const express = require("express");
const router = express.Router();
const userController = require("../controller/user/user.controller");
const AuthenticationMiddleware = require("../middleware/authentication.middleware.js");
const MulterMiddleware = require("../middleware/multer.middleware");

router.get("/check-email/:email", userController.checkEmail);
router.get("/", AuthenticationMiddleware.verify, userController.fetchUser);
router.put("/", AuthenticationMiddleware.verify, MulterMiddleware.single('image'), userController.updateUser);
router.put("/change-password", AuthenticationMiddleware.verify, userController.changePassword);
router.put("/change-email", AuthenticationMiddleware.verify, userController.changeEmail);

module.exports = router;
