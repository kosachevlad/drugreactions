'use strict';
module.exports = function(app) {
    console.log("drugRoutes init");
    var drugController = require('../controllers/drugController');

// Defines routes for calls the to drugs API

    app.route('/api/drugs')
        .get(drugController.getAllDrugs)
        //.post(drugController.createDrug)
        ;

    app.route('/api/drugs/:drugId')
        .get(drugController.getById)
        //.put(drugController.updateById)
        //.delete(drugController.deleteById)
        ;
    
    app.route('/api/reaction/:drugId')
        .get(drugController.getAllReactionsByDrugId)
        ;

    app.route('/api/reactions/')
        .get(drugController.getAllReactions)
        ;
};