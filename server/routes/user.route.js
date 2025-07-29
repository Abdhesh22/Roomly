const express = require("express");
const router = express.Router();
const userController = require("../controller/user/user.controller");
const AuthenticationController = require("../controller/authentication/authentication.controller");

router.get("/check-email/:email", userController.checkEmail);
router.post("/checkout", AuthenticationController.verify, userController.checkout);

module.exports = router;
