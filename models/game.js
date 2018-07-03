const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  _id: String,
  gameName: { type: String, required: true }, // unique?
  admin: { type: String, required: true },
  forkedFrom: { type: String },
  created: { type: String, default: Date.now },
  ratings: { type: Array },
  saved: Boolean, // this relation should exist in the Users collection
  public: { type: Boolean, default: false },
  versions: [
    {
      versionName: { type: String, required: true },
      date: { type: Date, default: Date.now },
      rules: { type: Array },
    }
  ]
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
