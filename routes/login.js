const express = require("express");
const router = express.Router();

var loginController = require("../controllers/login_signup");
var userController = require("../controllers/user");

// Login Route.
router.route("/").get(loginController.getLoginPage).post(userController.login);

module.exports = router;
