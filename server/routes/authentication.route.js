const express = require("express");
const router = express.Router();
const UserController = require("../controller/user/user.controller");

router.post("/user/verify-email", UserController.verifyEmail());
router.post("/user/sign-up", UserController.registerUser());

module.exports = router;
