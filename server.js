const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan"); // let's see what this does
const routes = require("./routes");

// const session = require("express-session");
// const passport = require("./config/passport");
const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(logger("dev")); // let's see what this does
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User authentication
// app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

var username = 'YOUR_USERNAME';
var password = 'YOUR_PASSWORD';
var hosts = 'iad2-c13-1.mongo.objectrocket.com:54555,iad2-c13-2.mongo.objectrocket.com:54555,iad2-c13-0.mongo.objectrocket.com:54555';
var database = 'YOUR_DATABASE_NAME';
var options = '?replicaSet=6c0f6352a2e546c6b87d828a365cae32';
var connectionString = 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options;

// Connect to the Mongo DB
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/kings");
mongoose.connect(connectionString)

// Ensure you have run 'npm install mongodb'
// var MongoClient = require('mongodb').MongoClient;


// MongoClient.connect(connectionString, function(err, db) {
//     if (db) {
//         db.close();
//     }
//     if (err) {
//         console.log('Error: ', err);
//     } else {
//         console.log('Connected!');
//         process.exit();
//     }
// });

// Start the API server
app.listen(PORT, function() {
  console.log(`API Server now listening on PORT ${PORT}!`);
});
