const Razorpay = require("razorpay");

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


    #generateReceipt = () => {
        const timestamp = Date.now().toString(36); // shorter base36 timestamp
        const randomStr = Math.random().toString(36).substring(2, 8); // 6 chars
        return `order_${timestamp}_${randomStr}`;
    };


    createOrder = async (amount, customerId, currency) => {
        try {
            const options = {
                amount: Math.round(parseFloat(amount) * 100),
                currency: currency,
                receipt: this.#generateReceipt(),
                customer_id: customerId,
                payment_capture: 1
            };
            return await this.#razorpayInstance.orders.create(options);
        } catch (error) {
            throw error;
        }
    }

    refundPayment = async (paymentId, { amount, reason }) => {
        return await this.#razorpayInstance.payments.refund(paymentId, {
            amount: Math.round(parseFloat(amount) * 100),
            speed: 'normal',
            notes: {
                reason: reason
            }
        });
    }

}

module.exports = RazorPayService;