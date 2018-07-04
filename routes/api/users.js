const router = require("express").Router();
const usersController = require("../../controllers/usersController");

router.route("/")
  .post(usersController.findOrCreate)
  .put(usersController.updateUserAsSeeded)

module.exports = router;