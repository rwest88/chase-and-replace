// For experimenting with Mongo queries
// The Mongo shell includes a JavaScript runtime, so we can declare variables, or whatever else.

// To start, load dummy data into local db. Open this folder in terminal and run: yarn seed
// This will also overwrite anything in the 'kings' db.

// Then start the Mongo shell and run: use db kings


// 1. Push a new version
// =====================

// syntax
db.games.update({"gameName" : "Variation_Kings_rwest88"}, { "$push" : { "versions" : {"rules":[{"1":"yo","2":"yoyo"}]} } } );

// We can use variables
var gameName = "Variation_Kings_rwest88"

var newVersion = {
  versionName: "hey yo",
  date: new Date(Date.now()),
  rules: [
    {
      "1": {
        name: "yo",
        instructions: "yoyoyoyoyoy"
      },
      "2": {
        name: "hey",
        instructions: "heyheyheyheyhey"
      } // etc
    }
  ]
};

// and put our variables in our query
db.games.update({"gameName" : gameName }, { "$push" : { "versions" : newVersion } } );


// 2. Pull the latest version (last in the array), and store it in a variable (obj)
// ================================================================================
var currentGame = db.games.find( {"gameName" : gameName }, { "versions" : { $slice: -1 } } )


// 3. Delete a version from a game
// ===============================
var {versionName: thisVersionName} = newVersion; // a lil destructuring, same as:
// var thisVersionName = newVersion.versionName;

db.games.update({"gameName" : gameName}, { $pull: { "versions" : { "versionName": thisVersionName } } }, false, true );