const PaymentAccountDAO = require("../../dao/payment-account.dao");
const RazorPayService = require("./razorpay.service");
const BookingDAO = require("../../dao/billing.dao");
const RefundDAO = require("../../dao/refund.dao");
const EmailTemplate = require("../../helper/email-template.helper");
const EmailService = require("../email/email.service");
const { EMAIL_TEMPLATE } = require("../../utilities/constants/email-template.constant");
const { BillingStatus, RefundStatus } = require("../../utilities/constants/booking-status.constant");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class PaymentService {
    #razorpayService;
    #sendRazorPayProccessedMail = async (refundId) => {

        const emailTemplate = new EmailTemplate();
        const emailService = new EmailService();
        const bookingDao = await BookingDAO.init();
        const refundDao = await RefundDAO.init()

        let refund = await refundDao.findOne({ refundId: refundId });
        if (!refund) return;

        const order = await bookingDao.getBookingDetailById({ _id: refund.bookingId.toString() });
        let userTemplateType, hostTemplateType;
        let status = '';

        switch (refund.type) {
            case RefundStatus.FULL_REFUND:
                userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL;
                hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL_HOST;
                status = BillingStatus.REFUND_BY_USER_PROCEDDED;
                break;

            case RefundStatus.PARTIAL_REFUND:
                userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL;
                hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL_HOST;
                status = BillingStatus.REFUND_PARTIAL_BY_USER_PROCEDDED;

                break;
            case RefundStatus.HOST_REFUND_FULL_REFUND:
                userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST;
                hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST_FULL_REFUND;
                status = BillingStatus.REFUND_BY_HOST_PROCEDDED;
                break;
        }

        await bookingDao.updateStatus(refund.bookingId.toString(), status);

        const tenantHtml = await emailTemplate.createTemplate(userTemplateType, { order: order[0], refundAmount: refund.amount });
        const tenantSubject = await emailTemplate.createSubject(userTemplateType, { title: order[0].room[0].title });

        // send email to host
        const hostHtml = await emailTemplate.createTemplate(hostTemplateType, { order: order[0], refundAmount: refund.amount });
        const hostSubject = `Booking Cancelled by Tenant: ${order[0].room[0].title}`;

        await emailService.sendMail({ to: order[0].tenant[0].email, subject: tenantSubject, html: tenantHtml });
        await emailService.sendMail({ to: order[0].host[0].email, subject: hostSubject, html: hostHtml });
    }
    #sendRazorPayFailedMail = (refundId) => {

    }
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
            console.log("error: ", error);
            throw error;
        }
    }

    createOrder = async (razorpayCustomer, { bookingDetails }) => {
        try {
            return await this.#razorpayService.createOrder(bookingDetails.total, razorpayCustomer.customerId, "INR");
        } catch (error) {
            console.log("error: ", error);
            throw error;
        }
    }

    refundPayment = async (paymentId, { amount, receipt }) => {
        return await this.#razorpayService.refundPayment(paymentId, { amount, receipt });
    }

    handleWebhookEvents = async (eventData) => {
        try {
            const { entity, event: eventType, account_id, contains, payload: events } = eventData;
            if (entity == 'event') {
                for (let index = 0; index < contains.length; index++) {
                    const key = contains[index];
                    if (!key) continue;
                    const eventEntity = events[key]?.entity;
                    if (!eventEntity) continue;
                    if (key == 'refund' && eventType == "refund.processed") {
                        if (eventEntity.status == 'processed') {
                            try {
                                await this.#sendRazorPayProccessedMail(eventEntity.id);
                            } catch (error) {
                                console.log(error);
                            }
                        } else if (eventEntity.status == 'failed') {
                            try {
                                this.#sendRazorPayFailedMail(eventEntity.id);
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

}

module.exports = PaymentService;