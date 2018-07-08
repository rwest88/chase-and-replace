const router = require("express").Router();
const usersController = require("../../controllers/usersController");

router.route("/")
  .put(usersController.updateUserAsSeeded)
  .post(usersController.createUser);

router.route("/:username")
  .get(usersController.getUser);

module.exports = router;