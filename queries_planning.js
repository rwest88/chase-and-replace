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


// 2. Find one game by gameName, and send back only the last item in the versions array (for loading latest version by default)
// ============================================================================================================================
db.games.find( {"gameName" : gameName }, { "versions" : { $slice: -1 } } )  // essentially how we load a game


// 3. Delete a version from a game
// ===============================
var {versionName: thisVersionName} = newVersion; // a lil destructuring, same as:
// var thisVersionName = newVersion.versionName;

db.games.update({"gameName" : gameName}, { $pull: { "versions" : { "versionName": thisVersionName } } }, false, true );


// 4. Find Many by {saved: true}
// =============================


// 5. Find Many by gameName or by admin (search)
// =============================================


// 6. Create game, sending error if a duplicate gameName exists. (Advanced: Only send error if {gameName and admin} both already exist)
// ====================================================================================================================================


// 7. Update a gameName (say, if a User is trying to fork a game with the same gameName as one of their own (and we implemented 6. Advanced))
// ==========================================================================================================================================
// find by _id


// 8. Update a game to {saved: true} or {saved: false} (may need to happen in the user schema)
// ===========================================================================================


// 9a. Create game upon 'saving' another game (forking), send error if gameName matches any of user's saved gameNames
// ==================================================================================================================


// /// 9b. Update {saved: true} and {forkedFrom: admin} and {admin: [userName]}
// /// ========================================================================
  ///// Change object locally


// 10. Delete a game (where {admin: [userName]} and {gameName: gameName})
// ======================================================================



// Many of these require knowing how [linking the user collection to the game collection] is going to work
// Remember that forking IS creating a new Game

// component state is going to be large :)