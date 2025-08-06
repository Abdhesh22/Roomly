const Razorpay = require("razorpay");
const DateTimeService = require("../date-time/date-time.service");

class RazorPayService {
    #razorpayInstance;
    constructor() {
        this.#razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }

    createCustomer = async (name, email) => {
        return await this.#razorpayInstance.customers.create({
            name,
            email
        });
    }

    makeOrder = async (amount, customerId, currency) => {
        const dateTime = new DateTimeService();
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: `order_rcptid_${await dateTime.getCurrentFormattedTime()}`,
            customer_id: customerId
        };
        return await this.#razorpayInstance.orders.create(options);
    }

}

module.exports = RazorPayService;