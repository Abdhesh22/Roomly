const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const PaymentService = require("../../services/payment/payment.service");

class WebhookController {
    handlePaymentEvent = async (req, res) => {
        try {
            res.status(httpStatus.OK).send({ status: true });
            const paymentService = new PaymentService();
            await paymentService.handleWebhookEvents(req.body);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new WebhookController();