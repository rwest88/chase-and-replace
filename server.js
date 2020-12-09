const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const routes = require("./routes");

// const session = require("express-session");
// const passport = require("./config/passport");
const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware
app.use(logger("dev"));
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

// Connect to the Mongo DB, then start the API server

const uri = "mongodb+srv://rwest88:rwest88@cluster0.asalx.mongodb.net/kings?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`API Server now listening on PORT ${PORT}!`)))
  .catch(err => console.log(err.message))

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/kings");

mongoose.set('useFindAndModify', false);