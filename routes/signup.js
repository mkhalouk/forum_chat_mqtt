const express = require("express");
const router = express.Router();

var signupController = require("../controllers/login_signup");
var userController = require("../controllers/user");

// Signup Route.
router.route("/").get(signupController.getSignupPage).post(userController.signUp);

module.exports = router;
