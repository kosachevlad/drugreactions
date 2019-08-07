# drugreactions
Exploring relationships between drugs and their reactions

# Purpose

This application is designed to allow pharmacists and physicians to explore a patient's drug regime to determine whether a symptom is likely to be a reaction to one of the prescription drugs they are taking, or whether it is more likely to arise from an underlying condition.

The drugs, reactions and the relationships between them are defined in tables containing static data. There is no facility to update them from within the application. Any updates come from an external reference and will be deployed out-of-band every 6 months or so.

This application is a (currently non-existent) client UI over a Node.js server over a sqlite database.

# First-time developer setup
Clone the application source code from https://{username}@ksc.git.cloudforge.com/drugreactions.git

At a Node.js command prompt, change to the top-level `drugreactions` source folder and run `npm install` to install all the server dependencies.

Change into the ./client folder and run `npm install` to install all the client dependencies.

(Re)create the sqlite database by running `db-definition\rebuild-database.bat`. This destroys and recreates the sqlite database from table definitions in the `sql` folder and from csv files in the `data` folder.

From the top-level source folder, fire up Visual Studio Code with `code .`

From the top-level source folder, run the application with `npm start`

With your browser, or an application like Postman, you should now be able to invoke a url like `localhost:3001/api/drugs/1490` and see a JSON response.


# Solution Organisation
The solution consists of a client part (a React UI created in the `client` folder with create-react-app) and a server part, implemented as a Node.js application.

During development, the application is run via `npm start` from the top-level source code folder, which should start the server AND launch the client UI.

`nodemon` is utilised in package.json to restart the server whenever any of the server files changes.

`concurrently` is used to start up the Webpack dev server and the Node.js server simultaneously upon `npm start`. But for all intents and purposes, the client and the server are two completely separate apps that could exist in their own discrete repositories.

# REST API

  Data is fetched via an API at `http://server:port/api/XXXX`, e.g.
  ~~~
    http://localhost:3000/api/drugs/1490
  ~~~
  The API routes are set up in `api/routes`, and registered with the express server in `server.js`
  The actual fetching is localised in controller-style functions, defined in `/api/controllers`

# SQLite Notes
  The database file is `db\drug-reactions.sqlite3`

### To rebuild the SQLite database
~~~
  db-definition\rebuild-database.bat
~~~
  Deletes, rebuilds and re-populates the SQLite database. 
  Data comes from tables in an Access database, which I manually export from Access into the 'db-definition/data' folder, as CSV files which are imported by the above script.

### Testing and ad-hoc queries against the database
To open the SQLite database for ad-hoc querying, run
~~~
  db-definition\open-database.bat
~~~
  Then try
~~~
  .schema
~~~
to see the schema of all the tables in the database. To see if there is any data, execute
~~~
    select ID, name_std, notes, PHARMACOLOGY from Drug where ID = 1490;
~~~
(This should return the same data as calling up `http://localhost:3000/api/drugs/1490` in the browser, or in Postman)

To get out of the sqlite command-line, type `.quit`

# References

### SQLite
 - npm docs: https://www.npmjs.com/package/sqlite3

 - API docs: https://github.com/mapbox/node-sqlite3/wiki

### React
 - React working with an API: https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
  **NB: Haven't set up the proxy yet**

### REST API
 - Building a REST API in Node.js: https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd