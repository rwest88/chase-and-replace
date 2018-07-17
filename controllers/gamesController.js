const db = require("../models");

// Defining methods for the gamesController
module.exports = {
  getDefaultGames: function(req, res) {
    db.Game
      .find({admin: req.params.name})
      .then(dbModel => {
        console.log(dbModel)
        console.log("where the hell is it")
        res.json(dbModel)})
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
        db.User.update( {userName: req.body.user_name}, { $push: { games: { $each: gameIDs } } }, {new: true} )
          .then(res => console.log("meowmeow"))
          .catch(err => console.log(err));
        res.json(dbModel);
      })
      .catch(err => console.log(err));
  },
  getGamesByUser: function(req, res) {
    if (req.body.search) {
      db.Game
      .find( { $and: [ {_id: { $in: req.body.gameIDs } }, { public: true } ] } )
      .sort({ created: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    } else {
      db.Game
      .find( { _id: { $in: req.body.gameIDs } } )
      .sort({ created: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
    }
  },
  searchGamesByName: function(req, res) {
    db.Game
      .find( { $and: [ {gameName: { $regex: req.params.searchTerm, $options: "i" } }, { public: true } ] } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getGame: function(req, res) {
    db.Game
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  deleteGame: function(req, res) {
    db.Game
      .remove({_id: req.params.id})
      .then(result => {
        db.User
          .update( {userName: req.params.user}, { $pull: { games: req.params.id } }, {new: true} )
          .then(dbModel => console.log(dbModel))
          .catch(err => console.log(err));
        res.json(result)
      })
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Game
      .create(req.body)
      .then(newGame => {
        console.log(newGame);
        db.User
          .update( {userName: newGame.admin}, { $push: { games: newGame._id } }, {new: true} )
          .then(result => res.json(newGame))
          .catch(err => console.log(err));
      })
      .catch(err => res.status(422).json(err));
  },
  // sortVersions: function(req, res) {
  //   console.log("agg");
  //   db.Game.aggregate( [ {$match: {_id: req.params.id}}, { $unwind: "$versions"}, { $sort: { "versions.date": -1 } } ] )
  //   .then(dbm => res.json(dbm))
  //   .catch(err => res.status(422).json(err));
  // },
  togglePublic: function(req, res) {
    db.Game.findOne({_id: req.body.gameID})
      .then(game => {
        console.log(game.public);
        db.Game.update({_id: req.body.gameID}, {$set: {public: !game.public}})
          .then(dbModel => res.json(dbModel))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },
  addSearchTag: function(req, res) {
    db.Game
      .update( { _id : req.body.id }, { $push : { tags : req.body.badge.name } } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  removeSearchTag: function(req, res) {
    db.Game
      .update( { _id : req.body.id }, { $pull : { tags : req.body.badge.name } } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  pushVersion: function(req, res) {
    db.Game
      .update( { _id : req.body.gameID }, { $push : { versions : { $each : [req.body.version], $sort : { date : 1 } } } } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  pullVersion: function(req, res) {
    db.Game
      .update({ _id: req.body.gameID }, { $pull: { versions: { _id: req.body.versionID } } } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};

// find queries inside queries_planning.js