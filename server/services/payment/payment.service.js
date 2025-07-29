const OrderSummaryDAO = require("../../dao/order-summary.dao");
const PaymentAccountDAO = require("../../dao/payment-account.dao");
const { Status } = require("../../utilities/constants/status.constant");
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

    #calculateBookingSummary = async (bookingDetails) => {
        const { userId, basePrice, nightCount, items, roomId } = bookingDetails;

        // Calculate extra charges for additional items (like extra guests)
        let extraCharges = 0;
        await items.forEach(item => {
            extraCharges += (item.price * item.quantity);
        });

        // Determine GST percentage based on declared tariff (base price per night)
        const gstRate = basePrice >= 7500 ? 18 : basePrice >= 1000 ? 12 : 0;

        // Calculate base amount and GST
        const roomCost = basePrice * nightCount;
        const gstAmount = (roomCost * gstRate) / 100;

        // Calculate grand total
        const grandTotal = roomCost + gstAmount + extraCharges;

        return {
            userId,
            roomId,
            basePricePerNight: basePrice,
            nightCount,
            roomCost,
            extraCharges,
            gstRate,
            gstAmount,
            grandTotal,
            items
        };
    };


    generateOrder = async (razorpayCustomer, bookingDetails) => {

        const bookingSummary = await this.#calculateBookingSummary(bookingDetails);
        const order = await this.#razorpayService.makeOrder(bookingSummary.grandTotal, razorpayCustomer.customerId, "INR");

        const orderSummaryDao = await OrderSummaryDAO.init();
        const orderSummary = await orderSummaryDao.create({
            ...bookingSummary,
            orderId: order.id,
            status: Status.PENDING
        })

        return {
            id: order.id,
            orderSummaryId: orderSummary._id,
            amount: bookingSummary.grandTotal
        };
    }


}

module.exports = PaymentService;