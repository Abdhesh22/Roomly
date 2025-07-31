const express = require("express");
const router = express.Router();
const userController = require("../controller/user/user.controller");
const AuthenticationMiddleware = require("../middleware/authentication.middleware");

router.get("/check-email/:email", userController.checkEmail);
router.post("/checkout", AuthenticationMiddleware.verify, userController.checkout);

module.exports = router;
