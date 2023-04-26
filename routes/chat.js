const express = require("express");
const router = express.Router();

var chatController = require("../controllers/chat");

// Chat Home Route.
router.get("/", chatController.getChatPage);

router.post("/", chatController.publishMQTTMessage);

module.exports = router;
