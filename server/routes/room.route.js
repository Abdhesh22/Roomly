const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../middleware/authentication.middleware");
const MulterMiddleware = require("../middleware/multer.middleware");
const RoomController = require("../controller/room/room.controller");

router.post('/', AuthenticationMiddleware.verify, MulterMiddleware.multiple('images'), RoomController.create);
router.post("/:roomId/booking", AuthenticationMiddleware.verify, RoomController.book);
router.get('/', AuthenticationMiddleware.verify, RoomController.roomList);
router.get('/:roomId', RoomController.getRoomDetails);
router.delete("/:roomId/status/:status", AuthenticationMiddleware.verify, RoomController.updateStatus);
router.put("/:roomId", AuthenticationMiddleware.verify, MulterMiddleware.multiple('images'), RoomController.update);

module.exports = router;
