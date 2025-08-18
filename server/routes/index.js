const express = require("express");
const router = express.Router();

router.use("/authentication", require("./authentication.route"));
router.use("/user", require("./user.route"));
router.use("/rooms", require("./room.route.js"));
router.use("/common", require("./common.route.js"));
router.use("/booking", require("./booking.route.js"));

module.exports = router;
