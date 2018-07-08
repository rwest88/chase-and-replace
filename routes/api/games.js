const router = require("express").Router();
const gamesController = require("../../controllers/gamesController");

// Matches with "/api/games"
router.route("/")
  .post(gamesController.create);
  
router.route("/versions")
  .put(gamesController.pushVersion)
  .post(gamesController.pullVersion);

// router.route("/versions/:id")
//   .get(gamesController.sortVersions);

router.route("/seed")
  .post(gamesController.getDefaultGames);

router.route("/clone")
  .post(gamesController.saveClones);

router.route("/user")
  .post(gamesController.getGamesByUser);

router.route("/:id")
  .get(gamesController.getGame)

// // Matches with "/api/books/:id"
// router
//   .route("/:id")
//   .get(booksController.findById)
//   .put(booksController.update)
//   .delete(booksController.remove);

module.exports = router;
