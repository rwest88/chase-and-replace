const db = require("../models");

module.exports = {
  findOrCreate: function(req, res) {
    db.User
      .find({userName: req.body.user_name}, {_id: 0})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  updateUserAsSeeded: function(req, res) {
    console.log("yo!")
    console.log(req.body.user_name)
    db.User
      .updateOne({userName: req.body.user_name}, { $set : { seeded : true } })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};