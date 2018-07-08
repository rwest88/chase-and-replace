const db = require("../models");

module.exports = {
  getUser: function(req, res) {
    db.User
      .find({userName: { $regex: req.params.username, $options: "i" } } )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  createUser: function(req, res) {
    db.User
      .create(req.body)
      .then(newUser => res.json(newUser))
      .catch(err => res.status(422).json(err));
  },
  updateUserAsSeeded: function(req, res) {
    db.User
      .updateOne({userName: req.body.user_name}, { $set : { seeded : true } })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};