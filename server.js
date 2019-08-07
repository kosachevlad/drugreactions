// The web server application for the drug-reaction database

const express = require("express");
const routes = require('./api/routes/drugRoutes'); // import route definitions for the RESTful API


const app = express();
const cors = require('cors');

app.set("port", process.env.PORT || 3001);

// register the routes for the RESTful API
console.log("Registering routes");
routes(app);


// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));  
}


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
// app.use(cors({
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }))


