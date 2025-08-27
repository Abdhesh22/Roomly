const express = require("express");
const router = express.Router();
const commonController = require("../controller/common/common.controller.js");

router.get("/ping", commonController.getPing);
router.get("/states", commonController.getStates);
router.get("/cities/:stateCode", commonController.getCities);
router.get("/amenities", commonController.getAmenities);

module.exports = router;