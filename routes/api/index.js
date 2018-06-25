const router = require("express").Router();
const bookRoutes = require("./books");
const fetch = require("./fetch");

// Book routes
router.use("/books", bookRoutes);

// router.use("/fetch", fetch); // just did this for practice

module.exports = router;
