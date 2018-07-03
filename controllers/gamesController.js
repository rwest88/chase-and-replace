const db = require("../models");

// Defining methods for the gamesController
module.exports = {
  findUserGames: function(req, res) {
    db.Game
      .find({forkedFrom: "Original"})
      .sort({ created: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  saveClones: function(req, res) {
    console.log(req.body);
    db.Game
      .insertMany(req.body.games)
      .then(dbModel => {
        console.log(dbModel);
        let gameIDs = dbModel.map(game => game._id);
        console.log(gameIDs);
        db.User.update({userName: req.body.user_name}, { $push: { games: { $each: gameIDs } } }, {new: true} )
          .then(res => console.log("meowmeow"))
          .catch(err => console.log(err));
        res.json(dbModel);
      })
      .catch(err => console.log(err));
  },
  findById: function(req, res) {
    db.Game
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Game
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  pushVersion: function(req, res) {
    console.log(req.body);
    console.log(req.body);
    console.log(req.body);
    db.Game
      .update({gameName : req.body.game }, { $push : { versions : req.body.version } } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Game
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

// find queries inside queries_planning.js