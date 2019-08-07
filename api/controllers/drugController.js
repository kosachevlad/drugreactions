'use strict';
const sqlite3 = require('sqlite3').verbose();

// Requests are routed to this file via drugRoutes.js

let db = new sqlite3.Database('db/drug-reactions.sqlite3', (err) => {
    if (err) {
      console.error("Startup error", err.message);
    }
    else 
    {
      console.log('Connected to the drug-reactions database.');
    }
    
    // I used this as a sanity check, to make sure I was able to get some data from the database
    // db.each("SELECT rowid AS id, NAME_STD FROM Drug", function(err, row) {
    //   console.log(row.id + ": " + row.NAME_STD);
    // });
  
});


const DRUG_COLUMNS = [
    "ID",
    "NAME_STD",
    "NOTES",
    "PHARMACOLOGY"
  ];

const REACTION_COLUMNS = [
  "DRUG_ID",
  "REACTION_ID",
  "DRUG_NAME_STD",
  "REACTION",
];

const getAllDrugsQuery = 'SELECT ID, NAME_STD from Drug WHERE ANALYSE=1;';
const getAllReactionsByDrugIdQuery = `SELECT ${REACTION_COLUMNS.join(", ")} FROM DrugReaction WHERE `;
const getAllReactionsQuery = 'SELECT REACTION FROM DrugReaction GROUP BY REACTION;';


// A handler for the route
//    /api/drugs
//
exports.getAllDrugs = function(req, res) {
    // console.log("getAllDrugs");

    db.all(getAllDrugsQuery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        let results = [];
        rows.forEach((row) => {
            let drugObject = {};
            drugObject["ID"] = row["ID"];
            drugObject["NAME_STD"] = row["NAME_STD"];
            results.push(drugObject);
        });
        res.json(results);
    });
};

  
//
// A handler for the route
//   /api/drugs/:drugId
// to fetch a single drug by its ID. Returns a 404 error if not found
exports.getById = function(req, res) {

    //console.log("getById");

    let drugId = req.params.drugId
    if (!drugId) {
        res.json({
            error: "Missing required parameter `drugId`"
        });
        return;
    }

    let query = `SELECT ${DRUG_COLUMNS.join(", ")} from Drug where ID = (?);`;

    //console.log(myquery);

    let drugObject = {};

    // 'db.each' seems a little dodgy, when we're expecting only 1 record at most.
    db.each(query, 
        drugId, 
        function(err, row) {
            // Only expecting 1 row. Popu;ate the object to be returned
            //console.log(row.ID + ": " + row.NAME_STD + ": " + row.PHARMACOLOGY);
            //console.log(row);

            // Copy each of the fields in the DRUG_COLUMNS array from the recordset into properties of the returned object
            DRUG_COLUMNS.forEach((colName,idx) => {
                //console.log(`colName: ${colName}, idx=${idx}, value=${row[colName]}`);
                drugObject[colName] = row[colName];
            });

        }, 
        // Completion function:
        function(err, rowCount) {
            //console.log(`Complete with ${rowCount} rows`);
            //console.log("Final result", retval);
            if (rowCount== 0) {
                console.log(`drug ${drugId} not found`)
                res.sendStatus(404);
            } else if (rowCount > 1) {
                console.error(`Too many rows: ${rowCount}`);
                res.sendStatus(500);
            }
            else {
                res.json(drugObject);
            }
        }
    );      
};


exports.getAllReactionsByDrugId = function(req, res) {
    // console.log("getAllReactionsByDrugId");

    const drugId = req.params.drugId
    if (!drugId) {
        res.json({
            error: "Missing required parameter `drugId`"
        });
        return;
    }

    db.all(getAllReactionsByDrugIdQuery + 'DRUG_ID=' + drugId.split(',').join(' OR DRUG_ID=') + ';', [], (err, rows) => {
        if (err) {
            throw err;
        }
        let results = [];
        rows.forEach((row) => {
            let reactionObject = {};
            REACTION_COLUMNS.forEach((colName,idx) => {
                reactionObject[colName] = row[colName];
            });
            results.push(reactionObject);
        });
        res.json(results);
    });
  };

  exports.getAllReactions = function(req, res) {
    // console.log("getAllReactions");
    db.all(getAllReactionsQuery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        let results = [];
        rows.forEach((row) => {
            let reactionObject = {};
            reactionObject['ID'] = row['REACTION'];
            reactionObject['NAME_STD'] = row['REACTION'];
            results.push(reactionObject);
        });
        res.json(results);
    });
  };