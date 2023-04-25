const express = require("express");
const router = express.Router();

var homeController = require("../controllers/home");

// Home Route.
router.get("/", homeController.getHomePage);

router.post("/", homeController.publishMQTTMessage);

module.exports = router;
