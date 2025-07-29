const express = require("express");
const router = express.Router();
const AuthenticationController = require("../controller/authentication/authentication.controller");
const RoomController = require("../controller/room/room.controller");

router.post("/:roomId/booking", AuthenticationController.verify, RoomController.booking);

module.exports = router;
