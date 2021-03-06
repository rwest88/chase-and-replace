// var mongoose = require("mongoose");
// var bcrypt = require("bcrypt-nodejs");

// // Save a reference to the Schema constructor
// var Schema = mongoose.Schema;

// // Using the Schema constructor, create a new UserSchema object
// // This is similar to a Sequelize model
// var UserSchema = new Schema({

//   // `userName` must be of type String
//   // `userName` must be unique, the default mongoose error message is thrown if a duplicate value is given
//   userName: {
//     type: String,
//     unique: true
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },

//   // `games` is an array that stores ObjectIds
//   // The ref property links these ObjectIds to the Game model
//   // This allows us to populate the User with any associated Games
//   games: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Game"
//     }
//   ]
// });

// UserSchema.pre('save', function (next) {
//   var user = this;
//   console.log("pee");
//   bcrypt.hashSync(user.password, 10, function (err, hash){
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   })
// });

// // This creates our model from the above schema, using mongoose's model method
// var User = mongoose.model("User", UserSchema);

// // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
// User.prototype.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };
// // Hooks are automatic methods that run during various phases of the User Model lifecycle
// // In this case, before a User is created, we will automatically hash their password


// // Export the User model
// module.exports = User;