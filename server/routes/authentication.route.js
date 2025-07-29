const express = require("express");
const router = express.Router();
const authenticationController = require("../controller/authentication/authentication.controller");

router.post("/send-otp", authenticationController.sendOtp);
router.post("/verify-otp", authenticationController.verifyOtp);
router.post("/register/user", authenticationController.registerUser);
router.get("/login", authenticationController.login);
module.exports = router;
