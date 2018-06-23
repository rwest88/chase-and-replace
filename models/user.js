var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var UserSchema = new Schema({
  
  // `userName` must be of type String
  // `userName` must be unique, the default mongoose error message is thrown if a duplicate value is given
  userName: {
    type: String,
    unique: true
  },

  // TO DO: add email and password
  

  // `games` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Game model
  // This allows us to populate the User with any associated Games
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;
