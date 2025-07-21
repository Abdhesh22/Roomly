const express = require("express");
const router = express.Router();

router.use("/authentication", require("./authentication.route"));

module.exports = router;
