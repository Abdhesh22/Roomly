const PaymentAccountDAO = require("../../dao/payment-account.dao");
const RazorPayService = require("./razorpay.service");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class PaymentService {
    #razorpayService;
    constructor() {
        this.#razorpayService = new RazorPayService();
    }

    createCustomer = async (user) => {
        try {

            const paymentAccountDao = await PaymentAccountDAO.init();
            const paymentAccount = await paymentAccountDao.findOne({ userId: user._id });

            if (paymentAccount) {
                return paymentAccount;
            }

            const name = `${user.firstName} ${user.lastName}`;
            const customer = await this.#razorpayService.createCustomer(name, user.email);

            return await paymentAccountDao.create({
                userId: new ObjectId(user._id),
                customerId: customer.id
            });

        } catch (error) {
            throw error;
        }
    }

    createOrder = async (razorpayCustomer, { bookingDetails }) => {
        return await this.#razorpayService.createOrder(bookingDetails.total, razorpayCustomer.customerId, "INR");
    }

    refundPayment = async (paymentId, { amount, receipt }) => {
        return await this.#razorpayService.refundPayment(paymentId, { amount, receipt });
    }

}

module.exports = PaymentService;