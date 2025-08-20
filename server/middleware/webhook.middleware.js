const crypto = require("crypto");

class WebhookMiddleWare {
    verifyRazorPay = async (req, res, next) => {
        try {

            const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET_KEY;
            const signature = req.headers["x-razorpay-signature"];
            if (!signature) {
                return res.status(400).json({ success: false, message: "Signature missing" });
            }

            const shasum = crypto.createHmac("sha256", webhookSecret);
            shasum.update(JSON.stringify(req.body)); // use raw body
            const digest = shasum.digest("hex");
            if (digest === signature) {
                return next();
            } else {
                return res.status(400).json({ success: false, message: "Invalid signature" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
}

module.exports = new WebhookMiddleWare();
