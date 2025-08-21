const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../middleware/authentication.middleware");
const MulterMiddleware = require("../middleware/multer.middleware");
const RoomController = require("../controller/room/room.controller");

router.post('/', AuthenticationMiddleware.verify, MulterMiddleware.multiple('images'), RoomController.create);
router.get('/', AuthenticationMiddleware.verify, RoomController.hostRoomList);
router.get('/detail/:roomId', RoomController.getRoomDetails);
router.get('/grid', RoomController.userRoomGrid);
router.delete("/:roomId/status/:status", AuthenticationMiddleware.verify, RoomController.updateStatus);
router.put("/:roomId", AuthenticationMiddleware.verify, MulterMiddleware.multiple('images'), RoomController.update);

module.exports = router;
