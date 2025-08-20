const express = require("express");
const router = express.Router();
const WebhookController = require("../../controller/webhook/webhook.controller");
const WebhookMiddleWare = require("../../middleware/webhook.middleware");

router.use("/razorpay", WebhookMiddleWare.verifyRazorPay, WebhookController.handlePaymentEvent);

module.exports = router;