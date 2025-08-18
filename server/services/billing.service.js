const BookingDAO = require("../dao/billing.dao");
const EmailTemplate = require("../helper/email-template.helper");
const { EMAIL_TEMPLATE } = require("../utilities/constants/email-template.constant");
const { BillingStatus, RefundStatus } = require("../utilities/constants/order-status.constant");
const EmailService = require("./email/email.service");
const PaymentService = require("./payment/payment.service");

class BillingService {

    checkout = async ({ user, bookingDetails, roomId, hostId }) => {
        try {

            const paymentService = new PaymentService();
            const bookingDao = await BookingDAO.init();

            const customer = await paymentService.createCustomer(user);
            const order = await paymentService.createOrder(customer, { roomId, bookingDetails, userId: user._id });

            const booking = await bookingDao.create({
                bookingDetails: bookingDetails,
                roomId,
                receipt: order.receipt,
                hostId,
                userId: user._id,
                billingId: order.id,
                status: BillingStatus.PAYMENT_IN_PROGRESS
            })

            return {
                order: {
                    id: order.id,
                    bookingId: booking._id,
                    amount: bookingSummary.grandTotal
                },
                customer
            }
        } catch (error) {
            throw error;
        }
    }

    getHostBooking = async (params) => {
        try {

            const bookingDao = await BookingDAO.init();

            const list = await bookingDao.getHostBooking(params);
            const length = await bookingDao.getHostBookingLength(params);

            return { list, length };
        } catch (error) {
            throw error;
        }
    }

    confirm = async (billingId, title) => {
        try {

            const bookingDao = await BookingDAO.init();

            const emailTemplate = new EmailTemplate();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: billingId });

            const html = await emailTemplate.createTemplate(EMAIL_TEMPLATE.ROOM_CONFIRMED, { order: order[0] });
            const subject = await emailTemplate.createSubject(EMAIL_TEMPLATE.ROOM_CONFIRMED, { title });

            await bookingDao.updateById(billingId, { status: BillingStatus.CONFIRMED });
            await emailService.sendMail({ to: booking.tenant[0].email, subject, html });

        } catch (error) {
            throw error;
        }
    }

    cancelByHost = async (billingId) => {
        try {

            const bookingDao = await BookingDAO.init();

            const emailTemplate = new EmailTemplate();
            const paymentService = new PaymentService();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: billingId });

            await paymentService.refundPayment(order[0].paymentId, { receipt: order[0].receipt, amount: order[0].bookingDetails.total, reason: 'Cancelled By Host' });

            const html = await emailTemplate.createTemplate(EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST, { order: order[0] });
            const subject = await emailTemplate.createSubject(EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_HOST, { title: order[0].room[0].title });

            await bookingDao.updateById(billingId, { status: BillingStatus.REFUND_BY_HOST_INITIATED });
            await emailService.sendMail({ to: order[0].tenant[0].email, subject, html });

        } catch (error) {
            throw error;
        }
    }

    bookingForUser = async (params) => {
        try {

            const bookingDao = await BookingDAO.init();

            const list = await bookingDao.bookingForUser(params);
            const length = await bookingDao.bookingForUserLength(params);

            return { list, length }
        } catch (error) {
            throw error;
        }
    }

    cancelByUser = async (billingId, refundStatus) => {
        try {

            const bookingDao = await BookingDAO.init();
            const paymentService = new PaymentService();
            const emailTemplate = new EmailTemplate();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: billingId });
            const bookingDetails = order[0].bookingDetails;
            let refundAmount = 0;
            let userTemplateType, hostTemplateType;

            switch (refundStatus) {
                case RefundStatus.FULL_REFUND:
                    refundAmount = bookingDetails.total;
                    await paymentService.refundPayment(order[0].paymentId, {
                        receipt: order[0].receipt,
                        amount: refundAmount,
                        reason: 'Cancelled By User Full Refund'
                    });
                    userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL;
                    hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL_HOST;
                    await bookingDao.updateById(billingId, { status: BillingStatus.REFUND_BY_USER_INITIATED });
                    break;

                case RefundStatus.PARTIAL_REFUND:
                    const firstNightCharge = bookingDetails.basePrice +
                        (bookingDetails.extraAdultRate * bookingDetails.extraAdultCount) +
                        (bookingDetails.childRate * bookingDetails.childCount) +
                        (bookingDetails.petRate * bookingDetails.petCount);
                    refundAmount = bookingDetails.total - firstNightCharge;

                    await paymentService.refundPayment(order[0].paymentId, {
                        receipt: order[0].receipt,
                        amount: refundAmount,
                        reason: 'Cancelled By User Partial Refund'
                    });
                    userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL;
                    hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL_HOST;
                    await bookingDao.updateById(billingId, { status: BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED });
                    break;

                case RefundStatus.NO_REFUND:
                    refundAmount = 0;
                    userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO;
                    hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO_HOST;
                    await bookingDao.updateById(billingId, { status: BillingStatus.BOOKING_CANCELLED });
                    break;
            }

            // send email to tenant
            const tenantHtml = await emailTemplate.createTemplate(userTemplateType, { order: order[0], refundAmount });
            const tenantSubject = await emailTemplate.createSubject(userTemplateType, { title: order[0].room[0].title });
            await emailService.sendMail({ to: order[0].tenant[0].email, subject: tenantSubject, html: tenantHtml });

            // send email to host
            const hostHtml = await emailTemplate.createTemplate(hostTemplateType, { order: order[0], refundAmount });
            const hostSubject = `Booking Cancelled by Tenant: ${order[0].room[0].title}`;
            await emailService.sendMail({ to: order[0].host[0].email, subject: hostSubject, html: hostHtml });

        } catch (error) {
            throw error;
        }
    };
}

module.exports = BillingService;