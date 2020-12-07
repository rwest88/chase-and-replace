const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Game collection and inserts the games below
// To apply this to Heroku:
// Add to package.json -- { "scripts" : { "heroku-postbuild": "node scripts/seedDB.js && npm run build" } }

// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost/kings"
// );

var username = 'kings';
var password = 'kingston';
var hosts = 'iad2-c13-1.mongo.objectrocket.com:54555,iad2-c13-2.mongo.objectrocket.com:54555,iad2-c13-0.mongo.objectrocket.com:54555';
var database = 'kings';
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

const gameSeed = [
  {
    gameName: "Classic Kings",
    admin: "Chase_Replacenson",
    forkedFrom: "",
    created: new Date(Date.now()),
    ratings: [],
    tags: [],
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
              "instructions": "Pick a category. Next player names a thing belonging to that category. Play continues clockwise until someone gets stumped or repeats an answer."
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
    "_id" : "Ryan's Dankness rwest88 152700",
    "ratings" : [],
    "public" : false,
    "gameName" : "Ryan's Dankness",
    "admin" : "rwest88",
    "forkedFrom" : "rwest88",
    "created" : "2018-07-17T00:57:20.490Z",
    "tags" : [],
    "versions" : [ 
      {
        "rules" : [ 
          {
              "rank" : "1"
          }, 
          {
              "name" : "Pew Pew",
              "instructions" : "Pick an opponent. Both players then pat their hips twice and make a choice, continuously and in rhythm. (clap clap [choice], clap clap [choice]). The choices are Reload, Block, and Shoot, all done with hand signals. He who shoots someone during reload, wins, and the other person must drink. (You cannot effectively shoot without prior reload. You may decide to play with one-round magazines or two-round.)",
              "rank" : "2"
          }, 
          {
              "rank" : "3",
              "name" : "Freestyle",
              "instructions" : "Have someone kick a beat, then go HAM"
          }, 
          {
              "rank" : "4",
              "name" : "Floor",
              "instructions" : "Do some break-dancing real quick."
          }, 
          {
              "rank" : "5",
              "name" : "I'm Still Alive",
              "instructions" : "Sing a Pearl Jam lyric, then drink. You must now say everything in Eddie Vedder's singing style until another 10 is drawn, and if you break character, you drink."
          }, 
          {
              "rank" : "6",
              "name" : "Sickest Skateboard",
              "instructions" : "Describe your vision of the sickest board."
          }, 
          {
              "rank" : "7",
              "name" : "Kevin Bacon",
              "instructions" : "Like the degrees of separation to Kevin Bacon, pick two players to each name an actor.  You must then chain them together through co-stars of movies. [Ex.: Jim Carrey to Juliette Lewis: Eternal Sunshine (Carrey and Winslet), Titanic (Winslet and DiCap), Gilbert Grape (DiCap and Lewis)]"
          }, 
          {
              "rank" : "8",
              "name" : "Paintball",
              "instructions" : "Describe your vision of the sweetest paintball gun."
          }, 
          {
              "rank" : "9",
              "name" : "Meow Master",
              "instructions" : "You are the meow master! Whenever you meow, the last person to respond with a meow must drink."
          }, 
          {
              "rank" : "10",
              "name" : "Sentences",
              "instructions" : "Starting with you and proceeding clockwise, players each say one word in attempt to tell a story. "
          }, 
          {
              "rank" : "11",
              "name" : "Truth or Dare",
              "instructions" : "Pick another player, and ask them \"truth or dare\", then make them uncomfortable."
          }, 
          {
              "rank" : "12",
              "name" : "Question Master",
              "instructions" : "You are the Question Master! Anytime you ask somebody a question, if he/she fails to respond with a question, he/she must drink."
          }, 
          {
              "rank" : "13",
              "name" : "Make a Rule",
              "instructions" : "Make a Global Rule for the current game!"
          }
        ],
        "versionName" : "init",
        "date" : new Date(Date.now())
      }
    ],
    "__v" : 0
  },
  {
    "_id" : "Star Wars n8morton 937458",
    gameName: "Star Wars",
    admin: "n8morton",
    forkedFrom: "",
    created: new Date(Date.now()),
    ratings: [],
    tags: [],
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
              "name": "Pour",
              "instructions": "Pour some of your drink into the King's Cup. Whoever draws the last 4 must down the cup."
          },
          {
              "rank": "5",
              "name": "Guys",
              "instructions": "All boys drink."
          },
          {
              "rank": "6",
              "name": "Death Sticks",
              "instructions": "Time for a smoke break."
          },
          {
              "rank": "7",
              "name": "Seven-Eleven",
              "instructions": "Leave the game and get more beer."
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
  }
];

// seed into db.User

const userSeed = [
  {
    userName: "n8morton",
    email: "n8morton@nate.com",
    password: "password",
    seeded: false
  },
  {
    userName: "rwest88",
    email: "rwest88.va@gmail.com",
    password: "ferndoggy",
    seeded: false
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

      for (let i in data) {
        db.User
          .update({"userName": data[i].admin}, { $push: { games: data[i]._id }, }, {new: true} )
          .then(() => {
            console.log(`${data[i]._id} inserted into ${data[i].admin}'s games!`);
            if (i == data.length - 1) {
              process.exit(0);
            }
          })
          .catch(err => {
            console.error(err);
            process.exit(1);
          });
      }
    
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
