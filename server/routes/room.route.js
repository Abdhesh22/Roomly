const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../middleware/authentication.middleware");
const MulterMiddleware = require("../middleware/multer.middleware");
const RoomController = require("../controller/room/room.controller");

router.post('/', AuthenticationMiddleware.verify, MulterMiddleware.multiple('images'), RoomController.create);
router.post("/:roomId/booking", AuthenticationMiddleware.verify, RoomController.book);

module.exports = router;
