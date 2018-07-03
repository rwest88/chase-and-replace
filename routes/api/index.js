const router = require("express").Router();
const gameRoutes = require("./games");
const userRoutes = require("./users");

// Game routes
router.use("/games", gameRoutes);
router.use("/users", userRoutes);

module.exports = router;
