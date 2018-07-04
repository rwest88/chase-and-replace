const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Game collection and inserts the games below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/kings"
);

const gameSeed = [
  {
    gameName: "Classic Kings",
    admin: "Chase_Replacenson",
    forkedFrom: "",
    created: new Date(Date.now()),
    ratings: [2, 5, 4, 5],
    saved: true,  // users collection
    public: false,
    versions: [
      {
        versionName: "init",
        date: new Date(Date.now()),
        rules: [
          {
              "rank": "1",
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
          },
          {
              "rank": "2",
              "name": "You",
              "instructions": "Pick a person, that person drinks."
          },
          {
              "rank": "3",
              "name": "Me",
              "instructions": "Drink. Yeah, you."
          },
          {
              "rank": "4",
              "name": "Floor",
              "instructions": "Last person to put a hand on the floor drinks."
          },
          {
              "rank": "5",
              "name": "Guys",
              "instructions": "All boys drink."
          },
          {
              "rank": "6",
              "name": "Chicks",
              "instructions": "All girls drink."
          },
          {
              "rank": "7",
              "name": "Heaven",
              "instructions": "Last person to raise both hands in the air must drink."
          },
          {
              "rank": "8",
              "name": "Pick a Mate",
              "instructions": "Pick a person. For the rest of the game, whenever you drink, that person must drink."
          },
          {
              "rank": "9",
              "name": "Bust a Rhyme",
              "instructions": "Say a word. Play continues clockwise. Whoever gets stumped on rhyming must drink."
          },
          {
              "rank": "10",
              "name": "Categories",
              "instructions": "Pick a category. Say a thing belonging to that category. Play continues clockwise blah blah blah blah blah blah blah."
          },
          {
              "rank": "11",
              "name": "I Never",
              "instructions": "Everyone raises three (or five) fingers and starts a game of 'Never Have I Ever'."
          },
          {
              "rank": "12",
              "name": "Question Master",
              "instructions": "You are the Question Master! Anytime you ask somebody a question, if he/she fails to respond with a question, he/she must drink."
          },
          {
              "rank": "13",
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
          }
        ]
      }
    ]
  },
  {
    gameName: "Star Wars",
    admin: "n8morton",
    forkedFrom: "n8morton",
    created: new Date(Date.now()),
    ratings: [5, 5, 4, 5, 5, 2, 1, 4, 5, 3, 5, 5, 4, 5],
    saved: true,  // users collection
    public: true,
    versions: [
      {
        versionName: "init",
        date: new Date(Date.now()),
        rules: [
          {
              "rank": "1",
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
          },
          {
              "rank": "2",
              "name": "Artoo",
              "instructions": "Do best R2D2 impression, and then continue play clockwise. Vote for the loser who must drink."
          },
          {
              "rank": "3",
              "name": "C3PO",
              "instructions": "You must remain as C3PO until another three is drawn. (Accent must stay and arms may not break position. Whenever they do, you drink.)"
          },
          {
              "rank": "4",
              "name": "Floor",
              "instructions": "Last person to put a hand on the floor drinks."
          },
          {
              "rank": "5",
              "name": "Guys",
              "instructions": "All boys drink."
          },
          {
              "rank": "6",
              "name": "Chicks",
              "instructions": "All girls drink."
          },
          {
              "rank": "7",
              "name": "Methods (js)",
              "instructions": "Proceeding clockwise, list off JavaScript methods (of a chosen topic: Strings, Arrays, Objects, the Math module, etc. He who gets stumped must drink."
          },
          {
              "rank": "8",
              "name": "Pick a Nate",
              "instructions": "For the duration of the game, Nate must drink once for every person drinking, times the number of eights drawn."
          },
          {
              "rank": "9",
              "name": "Chewy",
              "instructions": "Make the Chewbacca noise, and then drink."
          },
          {
              "rank": "10",
              "name": "Star Wars Categories",
              "instructions": "Pick a Star Wars category, such as planets, vehicles, characters, etc. Say a thing belonging to that category. Play continues clockwise. If you get stumped, you must drink."
          },
          {
              "rank": "11",
              "name": "I Never (Star Wars ed.)",
              "instructions": "Everyone raises three (or five) fingers and starts a game of 'Never Have I Ever'. All responses must contain a Star-Wars reference."
          },
          {
              "rank": "12",
              "name": "Princesses",
              "instructions": "You're in the hot seat for a round of 'Would You Rather'"
          },
          {
              "rank": "13",
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
          }
        ]
      }
    ]
  },
  {
    gameName: "Kings_Variation",
    admin: "a",
    forkedFrom: "",
    created: new Date(Date.now()),
    ratings: [],
    saved: true,  // users collection
    public: false,
    versions: [
      {
        versionName: "init",
        date: new Date(Date.now()),
        rules: [
          {
              "rank": "1",
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
          },
          {
              "rank": "2",
              "name": "Poo",
              "instructions": "Throw poo."
          },
          {
              "rank": "3",
              "name": "Pee",
              "instructions": "Throw pee."
          },
          {
              "rank": "4",
              "name": "Score",
              "instructions": "And seven years ago."
          },
          {
              "rank": "5",
              "name": "Hive",
              "instructions": "Find a beehive and eat it."
          },
          {
              "rank": "6",
              "name": "Dicks",
              "instructions": "Eat a bag of dicks."
          },
          {
              "rank": "7",
              "name": "Seven-Eleven",
              "instructions": "Leave the game and get more beer."
          },
          {
              "rank": "8",
              "name": "Cate",
              "instructions": "Cate must drink."
          },
          {
              "rank": "9",
              "name": "Stein",
              "instructions": "Chug 32 oz of beer."
          },
          {
              "rank": "10",
              "name": "Win",
              "instructions": "You win! Drink."
          },
          {
              "rank": "11",
              "name": "Snack",
              "instructions": "Grab a snack."
          },
          {
              "rank": "12",
              "name": "Questions",
              "instructions": "Ask someone a question. That person must then ask another player a question, and so on. Whoever messes up drinks."
          },
          {
              "rank": "13",
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
          }
        ]
      }
    ]
  },
  {
    gameName: "Custom",
    admin: "Chase_Replacenson",
    forkedFrom: "",
    created: new Date(Date.now()),
    ratings: [],
    saved: true,  // users collection
    public: false,
    versions: [
      {
        versionName: "init",
        date: new Date(Date.now()),
        rules: [
          {
              "rank": "1",
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
          },
          {
              "rank": "2",
              "name": "Artoo",
              "instructions": "Do best R2D2 impression, and then continue play clockwise. Vote for the loser who must drink."
          },
          {
              "rank": "3",
              "name": "C3PO",
              "instructions": "You must remain as C3PO until another three is drawn. (Accent must stay and arms may not break position. Whenever they do, you drink.)"
          },
          {
              "rank": "4",
              "name": "Floor",
              "instructions": "Last person to put a hand on the floor drinks."
          },
          {
              "rank": "5",
              "name": "Guys",
              "instructions": "All boys drink."
          },
          {
              "rank": "6",
              "name": "Chicks",
              "instructions": "All girls drink."
          },
          {
              "rank": "7",
              "name": "Methods (js)",
              "instructions": "Proceeding clockwise, list off JavaScript methods (of a chosen topic: Strings, Arrays, Objects, the Math module, etc. He who gets stumped must drink."
          },
          {
              "rank": "8",
              "name": "Pick a Nate",
              "instructions": "For the duration of the game, Nate must drink once for every person drinking, times the number of eights drawn."
          },
          {
              "rank": "9",
              "name": "Chewy",
              "instructions": "Make the Chewbacca noise, and then drink."
          },
          {
              "rank": "10",
              "name": "Star Wars Categories",
              "instructions": "Pick a Star Wars category, such as planets, vehicles, characters, etc. Say a thing belonging to that category. Play continues clockwise. If you get stumped, you must drink."
          },
          {
              "rank": "11",
              "name": "I Never (Star Wars ed.)",
              "instructions": "Everyone raises three (or five) fingers and starts a game of 'Never Have I Ever'. All responses must contain a Star-Wars reference."
          },
          {
              "rank": "12",
              "name": "Princesses",
              "instructions": "You're in the hot seat for a round of 'Would You Rather'"
          },
          {
              "rank": "13",
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
          }
        ]
      }
    ]
  },

  {
    gameName: "Shitty Game",
    admin: "Some Dude",
    forkedFrom: "Some Dude",
    created: new Date(Date.now()),
    ratings: [],
    saved: true,  // users collection
    public: false,
    versions: [
      {
        versionName: "init",
        date: new Date(Date.now()),
        rules: [
          {
              "rank": "1",
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
          },
          {
              "rank": "2",
              "name": "asdfasdf",
              "instructions": "asdfasdf."
          },
          {
              "rank": "3",
              "name": "asdfasdf",
              "instructions": "asdfasdf"
          },
          {
              "rank": "4",
              "name": "Floor",
              "instructions": "Last person to put a hand on the floor drinks."
          },
          {
              "rank": "5",
              "name": "Guys",
              "instructions": "All boys drink."
          },
          {
              "rank": "6",
              "name": "Chicks",
              "instructions": "All girls drink."
          },
          {
              "rank": "7",
              "name": "asdfadsf",
              "instructions": "asdfasdf"
          },
          {
              "rank": "8",
              "name": "asdfasdf",
              "instructions": "asdfasdf"
          },
          {
              "rank": "9",
              "name": "asdfasdfy",
              "instructions": "asdfasdf"
          },
          {
              "rank": "10",
              "name": "werwetewr",
              "instructions": "ewrtwert."
          },
          {
              "rank": "11",
              "name": "wertewrt",
              "instructions": "oiewruthjwerg"
          },
          {
              "rank": "12",
              "name": "oiawue45ewrt",
              "instructions": "elritu3t4er"
          },
          {
              "rank": "13",
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
          }
        ]
      }
    ]
  }
];

// seed into db.User

const userSeed = [
  {
    userName: "n8morton",
    email: "n8morton@nate.com",
    password: "password"
  },
  {
    userName: "rwest88",
    email: "rwest88.va@gmail.com",
    password: "ferndoggy"
  }
];


// user
// game
// user

db.User
  .remove({})
  .then(() => db.User.create(userSeed))
  .then(data => {
    console.log(data.length + " records inserted into User collection!");

    db.Game
    .remove({})
    .then(() => db.Game.insertMany(gameSeed))
    .then(data => {
      console.log(data.length + " records inserted into Game collection!");

      //grab all games that are "original" and put them in an array
      db.Game.find({"forkedFrom": "Original"}).then((data) => {
        const gameIDs = data.map(game => game._id)

        
      
        //loop through all users to add any games created by them or any default/original games
        for (let i in data) {
          // create array of games containing any games mathcing userename as well as all default games and remove any duplicatres
          let gamesToAdd = [data[i]._id, ...gameIDs.filter(id => id !== data[i]._id)]
          console.log(gamesToAdd);
          db.User
          //push created array into users games
            .update({"userName": data[i].admin}, { $push: { games: { $each: gamesToAdd } } }, {new: true} )

            .then(() => {
                console.log(`${data[i]._id} inserted into ${data[i].admin}'s games!`);
                // if (i == data.length - 1) {
                //   process.exit(0);
                // }
            })
            .catch(err => {
                console.error(err);
                process.exit(1);
            });
        }
      });
    
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });



 
// what a damn doozy that was!


  // db.Game
  //   .remove({})
  //   .then(() => db.Game.insertMany(gameSeed))
  //   .then(data => {
  //     console.log(data.length + " records inserted into Game collection!");
  //     process.exit(0);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     process.exit(1);
  //   });


// for (let i in gameSeed) {
//   db.User
//     .findOneAndUpdate({"userName": gameSeed[i].admin}, { $push: { games: gameSeed[i]._id } } )
//     .then(data => {
//         console.log("1 Game._id inserted into User.games!");
//         process.exit(0);
//     })
//     .catch(err => {
//         console.error(err);
//         process.exit(1);
//     });
// }






  // step 3
  // return db.User.findOneAndUpdate({"userName": gameSeed[i].data}, { $push: { games: dbGame._id } }, { new: true });



// db.User
//   .remove({})
  
//   .then(data => {
//     console.log(data.length + " records inserted!");
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });

// // Route for saving a new Game to the db and associating it with a User

// // Create a new Game in the db
// db.Game.create(req.body)
//   .then(function(dbGame) {
//     // If a Game was created successfully, find one User (there's only one) and push the new Game's _id to the User's `Games` array
//     // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//     // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//     return db.User.findOneAndUpdate({}, { $push: { games: dbGame._id } }, { new: true });
//   })
//   .then(function(dbUser) {
//     // If the User was updated successfully, send it back to the client
//     res.json(dbUser);
//   })
//   .catch(function(err) {
//     // If an error occurs, send it back to the client
//     res.json(err);
//   });




  // what is the {new: true} param?

// can we seed this in production?

