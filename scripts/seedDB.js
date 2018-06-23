const mongoose = require("mongoose");
const db = require("../models");
mongoose.Promise = global.Promise;

// This file empties the Game collection and inserts the games below

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/kings"
);

const gameSeed = [
  {
    gameName: "Classic_Kings_rwest88",
    admin: "rwest88",
    forkedFrom: "Chase_Replacenson",
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
            "2": {
              "name": "You",
              "instructions": "Pick a person, that person drinks."
            }
          },
          {
            "3": {
              "name": "Me",
              "instructions": "Drink. Yeah, you."
            }
          },
          {
            "4": {
              "name": "Floor",
              "instructions": "Last person to put a hand on the floor drinks."
            }
          },
          {
            "5": {
              "name": "Guys",
              "instructions": "All boys drink."
            }
          },
          {
            "6": {
              "name": "Chicks",
              "instructions": "All girls drink."
            }
          },
          {
            "7": {
              "name": "Heaven",
              "instructions": "Last person to raise both hands in the air must drink."
            }
          },
          {
            "8": {
              "name": "Pick a Mate",
              "instructions": "Pick a person. For the rest of the game, whenever you drink, that person must drink."
            }
          },
          {
            "9": {
              "name": "Bust a Rhyme",
              "instructions": "Say a word. Play continues clockwise blah blah blah"
            }
          },
          {
            "10": {
              "name": "Categories",
              "instructions": "Pick a category. Say a thing belonging to that category. Play continues clockwise blah blah blah blah blah blah blah."
            }
          },
          {
            "J": {
              "name": "I Never",
              "instructions": "Everyone raises three (or five) fingers and starts a game of 'Never Have I Ever'."
            }
          },
          {
            "Q": {
              "name": "Questions",
              "instructions": "klasjd kadsjf ;lakdsjf ;laskdjf ;ladsjf;l aksjdf;lka sdfk;ljasd ;lkjadsf;lk jasdfk;lj lskdjflaskdjf?"
            }
          },
          {
            "K": {
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
            }
          },
          {
            "A": {
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
            }
          }
        ]
      },
    ]
  },
  {
    gameName: "Variation_Kings_rwest88",
    admin: "rwest88",
    forkedFrom: "Chase_Replacenson",
    created: new Date(Date.now()),
    ratings: [1, 2, 1, 1, 1, 3, 1, 1, 5],
    saved: false,  // users collection
    public: false,
    versions: [
      {
        versionName: "init",
        date: new Date(Date.now()),
        rules: [
          {
            "2": {
              "name": "Poo",
              "instructions": "Throw poo."
            }
          },
          {
            "3": {
              "name": "Pee",
              "instructions": "Throw pee."
            }
          },
          {
            "4": {
              "name": "Score",
              "instructions": "And seven years ago."
            }
          },
          {
            "5": {
              "name": "Hive",
              "instructions": "Find a beehive and eat it."
            }
          },
          {
            "6": {
              "name": "Dicks",
              "instructions": "Eat a bag of dicks."
            }
          },
          {
            "7": {
              "name": "Seven-Eleven",
              "instructions": "Leave the game and get more beer."
            }
          },
          {
            "8": {
              "name": "Cate",
              "instructions": "Cate must drink."
            }
          },
          {
            "9": {
              "name": "Stein",
              "instructions": "Chug 32 oz of beer."
            }
          },
          {
            "10": {
              "name": "Win",
              "instructions": "You win! Drink."
            }
          },
          {
            "J": {
              "name": "asdfasdf",
              "instructions": "asdf"
            }
          },
          {
            "Q": {
              "name": "lkjalk",
              "instructions": "kla;lj lskdjflaskdjf?"
            }
          },
          {
            "K": {
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
            }
          },
          {
            "A": {
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
            }
          }
        ]
      },
      {
        versionName: "piss",
        date: new Date(Date.now()),
        rules: [
          {
            "2": {
              "name": "piss",
              "instructions": "piss"
            }
          },
          {
            "3": {
              "name": "Pee",
              "instructions": "piss"
            }
          },
          {
            "4": {
              "name": "Urinate",
              "instructions": "piss"
            }
          },
          {
            "5": {
              "name": "Hive",
              "instructions": "piss on a beehive"
            }
          },
          {
            "6": {
              "name": "Dicks",
              "instructions": "piss"
            }
          },
          {
            "7": {
              "name": "Spring a Leak",
              "instructions": "piss"
            }
          },
          {
            "8": {
              "name": "Cate",
              "instructions": "piss on Cate"
            }
          },
          {
            "9": {
              "name": "Wine",
              "instructions": "pee in a wine glass"
            }
          },
          {
            "10": {
              "name": "I dunno",
              "instructions": "hmm."
            }
          },
          {
            "J": {
              "name": "Jack-o-Lantern",
              "instructions": "pee in a pumpkin"
            }
          },
          {
            "Q": {
              "name": "Queen Pee",
              "instructions": "pee in a dress"
            }
          },
          {
            "K": {
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
            }
          },
          {
            "A": {
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
            }
          }
        ]
      }
    ]
  },
  {
    gameName: "Star Wars",
    admin: "n8morton",
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
            "2": {
              "name": "Artoo",
              "instructions": "Do best R2D2 impression, and then continue play clockwise. Vote for the loser who must drink."
            }
          },
          {
            "3": {
              "name": "Me",
              "instructions": "Drink. Yeah, you."
            }
          },
          {
            "4": {
              "name": "Floor",
              "instructions": "Last person to put a hand on the floor drinks."
            }
          },
          {
            "5": {
              "name": "Guys",
              "instructions": "All boys drink."
            }
          },
          {
            "6": {
              "name": "Chicks",
              "instructions": "All girls drink."
            }
          },
          {
            "7": {
              "name": "Heaven",
              "instructions": "Last person to raise both hands in the air must drink."
            }
          },
          {
            "8": {
              "name": "Pick a Mate",
              "instructions": "Pick a person. For the rest of the game, whenever you drink, that person must drink."
            }
          },
          {
            "9": {
              "name": "Chewy",
              "instructions": "Make the Chewbacca noise, and then drink."
            }
          },
          {
            "10": {
              "name": "Star Wars Categories",
              "instructions": "Pick a Star Wars category, such as planets, vehicles, characters, etc. Say a thing belonging to that category. Play continues clockwise. If you get stumped, you must drink."
            }
          },
          {
            "J": {
              "name": "I Never (Star Wars edition)",
              "instructions": "Everyone raises three (or five) fingers and starts a game of 'Never Have I Ever'. All responses must contain a Star-Wars reference."
            }
          },
          {
            "Q": {
              "name": "Princesses",
              "instructions": "You're in the hot seat for a round of 'Would You Rather'"
            }
          },
          {
            "K": {
              "name": "Make a Rule",
              "instructions": "Make a global rule for the current game!"
            }
          },
          {
            "A": {
              "name": "Chase and Replace",
              "instructions": "Everybody drinks! If anyone is feeling bold, take a shot and a chaser. Then, choose a rank (other than King and Ace) and change the rule for that card."
            }
          }
        ]
      },
    ]
  }
];

db.Game
  .remove({})
  .then(() => db.Game.collection.insertMany(gameSeed))
  .then(data => {
    console.log(data.insertedIds.length + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
