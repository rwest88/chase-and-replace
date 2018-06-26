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

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/kings");

// Start the API server
app.listen(PORT, function() {
  console.log(`API Server now listening on PORT ${PORT}!`);
});
