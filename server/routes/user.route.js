const express = require("express");
const router = express.Router();
const userController = require("../controller/user/user.controller");

router.get("/check-email/:email", userController.checkEmail);

module.exports = router;
