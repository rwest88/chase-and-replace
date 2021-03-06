const router = require("express").Router();
const gamesController = require("../../controllers/gamesController");

// Matches with "/api/games"
router.route("/")
  .put(gamesController.togglePublic)
  .post(gamesController.create);

router.route("/:id")
  .get(gamesController.getGame);

router.route("/:id/:user")
  .delete(gamesController.deleteGame);
  
router.route("/versions")
  .put(gamesController.pushVersion)
  .post(gamesController.pullVersion);

router.route("/seed")
  .post(gamesController.saveClones);

router.route("/seed/:name")
  .get(gamesController.getDefaultGames);

router.route("/user")
  .post(gamesController.getGamesByUser);

router.route("/search/:searchTerm")
  .get(gamesController.searchGamesByName);

router.route("/search")
  .put(gamesController.addSearchTag)
  .post(gamesController.removeSearchTag);

module.exports = router;
