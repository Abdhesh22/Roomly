const BookingDAO = require("../dao/billing.dao");
const RefundDAO = require("../dao/refund.dao");
const EmailTemplate = require("../helper/email-template.helper");
const { EMAIL_TEMPLATE } = require("../utilities/constants/email-template.constant");
const { BillingStatus, RefundStatus } = require("../utilities/constants/order-status.constant");
const EmailService = require("./email/email.service");
const PaymentService = require("./payment/payment.service");

class BillingService {

    book = async ({ bookingId, paymentId }) => {
        try {

            const bookingDao = await BookingDAO.init();

            await bookingDao.updateById(bookingId, { paymentId: paymentId });
            await bookingDao.updateStatus(bookingId, BillingStatus.PAYMENT_DONE);

            //Now sending message your booking has been done
            const emailTemplate = new EmailTemplate();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: bookingId });

            //send email to user
            const tenantHtml = await emailTemplate.createTemplate(EMAIL_TEMPLATE.BOOKING_PAYMENT_RECEIVED_TENANT, { order: order[0] });
            const tenantSubject = await emailTemplate.createSubject(EMAIL_TEMPLATE.BOOKING_PAYMENT_RECEIVED_TENANT, { title: order[0].room[0].title });
            await emailService.sendMail({ to: order[0].tenant[0].email, subject: tenantSubject, html: tenantHtml });

            // send email to host
            const hostHtml = await emailTemplate.createTemplate(EMAIL_TEMPLATE.NEW_BOOKING_HOST, { order: order[0] });
            const hostSubject = await emailTemplate.createSubject(EMAIL_TEMPLATE.NEW_BOOKING_HOST, { title: order[0].room[0].title });
            await emailService.sendMail({ to: order[0].host[0].email, subject: hostSubject, html: hostHtml });

            return;
        } catch (error) {
            throw error;
        }
    }

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
                billingId: order.id
            })

            await bookingDao.updateStatus(booking._id, BillingStatus.PAYMENT_IN_PROGRESS);

            return {
                order: {
                    id: order.id,
                    bookingId: booking._id,
                    amount: bookingDetails.grandTotal
                },
                customer
            }
        } catch (error) {
            console.log("error: ", error);
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

            await bookingDao.updateStatus(billingId, BillingStatus.CONFIRMED);
            await emailService.sendMail({ to: order[0].tenant[0].email, subject, html });

        } catch (error) {
            throw error;
        }
    }

    cancelByHost = async (billingId) => {
        try {

            const bookingDao = await BookingDAO.init();
            const refundDao = await RefundDAO.init();
            const paymentService = new PaymentService();
            const order = await bookingDao.getBookingDetailById({ _id: billingId });
            const refund = await paymentService.refundPayment(order[0].paymentId, { receipt: order[0].receipt, amount: order[0].bookingDetails.total, reason: 'Cancelled By Host' });

            await bookingDao.updateStatus(billingId, BillingStatus.REFUND_BY_HOST_INITIATED);
            await refundDao.create({
                refundId: refund?.id,
                bookingId: billingId,
                amount: order[0].bookingDetails.total,
                type: RefundStatus.HOST_REFUND_FULL_REFUND,
                status: refund?.status,
                reason: 'Cancelled By Host'
            })

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
            const refundDao = await RefundDAO.init();

            const order = await bookingDao.getBookingDetailById({ _id: billingId });
            const bookingDetails = order[0].bookingDetails;
            let refundAmount = 0;
            let refund = null;
            let userTemplateType, hostTemplateType;
            let reason;
            let status;
            switch (refundStatus) {
                case RefundStatus.FULL_REFUND:

                    refundAmount = bookingDetails.total;
                    reason = 'Cancelled By User Full Refund';

                    refund = await paymentService.refundPayment(order[0].paymentId, {
                        receipt: order[0].receipt,
                        amount: refundAmount,
                        reason: reason
                    });
                    userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL;
                    hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_FULL_HOST;
                    status = BillingStatus.REFUND_BY_USER_INITIATED
                    break;

                case RefundStatus.PARTIAL_REFUND:
                    const firstNightCharge = bookingDetails.basePrice +
                        (bookingDetails.extraAdultRate * bookingDetails.extraAdultCount) +
                        (bookingDetails.childRate * bookingDetails.childCount) +
                        (bookingDetails.petRate * bookingDetails.petCount);
                    refundAmount = bookingDetails.total - firstNightCharge;
                    reason = 'Cancelled By User Partial Refund';
                    refund = await paymentService.refundPayment(order[0].paymentId, {
                        receipt: order[0].receipt,
                        amount: refundAmount,
                        reason: reason
                    });
                    userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL;
                    hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_PARTIAL_HOST;
                    status = BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED;
                    break;

                case RefundStatus.NO_REFUND:
                    refundAmount = 0;
                    reason = 'Cancelled By User No Refund';
                    userTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO;
                    hostTemplateType = EMAIL_TEMPLATE.BOOKING_CANCELLED_BY_USER_NO_HOST;
                    status = BillingStatus.BOOKING_CANCELLED;
                    break;
            }

            await bookingDao.updateStatus(billingId, status);
            await refundDao.create({
                refundId: refund?.id,
                bookingId: billingId,
                amount: refundAmount,
                type: refundStatus,
                status: refund?.status,
                reason: reason
            })

            console.log("refundStatus == RefundStatus.NO_REFUND: ", refundStatus == RefundStatus.NO_REFUND);
            if (refundStatus == RefundStatus.NO_REFUND) {
                const tenantHtml = await emailTemplate.createTemplate(userTemplateType, { order: order[0], refundAmount: refund.amount });
                const tenantSubject = await emailTemplate.createSubject(userTemplateType, { title: order[0].room[0].title });
                await emailService.sendMail({ to: order[0].tenant[0].email, subject: tenantSubject, html: tenantHtml });

                // send email to host
                const hostHtml = await emailTemplate.createTemplate(hostTemplateType, { order: order[0], refundAmount: refund.amount });
                const hostSubject = `Booking Cancelled by Tenant: ${order[0].room[0].title}`;
                await emailService.sendMail({ to: order[0].host[0].email, subject: hostSubject, html: hostHtml });
            }

        } catch (error) {
            throw error;
        }
    };

    updateStatus = async ({ billingId, status }) => {
        try {

            const bookingDao = await BookingDAO.init();
            await bookingDao.updateStatus(billingId, status);

        } catch (error) {
            throw error;
        }
    }
}

module.exports = BillingService;