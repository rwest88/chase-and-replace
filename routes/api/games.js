const router = require("express").Router();
const gamesController = require("../../controllers/gamesController");

// Matches with "/api/games"
router.route("/")
  .put(gamesController.pushVersion)
  .post(gamesController.create);

router.route("/seed")
  .post(gamesController.findUserGames);

router.route("/clone")
  .post(gamesController.saveClones);


// // Matches with "/api/books/:id"
// router
//   .route("/:id")
//   .get(booksController.findById)
//   .put(booksController.update)
//   .delete(booksController.remove);

module.exports = router;
