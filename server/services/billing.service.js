const BookingDAO = require("../dao/billing.dao");
const RefundDAO = require("../dao/refund.dao");
const RoomBlockRangeDAO = require("../dao/room-block-range.dao");
const EmailTemplate = require("../helper/email-template.helper");
const { EMAIL_TEMPLATE } = require("../utilities/constants/email-template.constant");
const { BillingStatus, RefundStatus, BookingTime } = require("../utilities/constants/booking-status.constant");
const { toaster } = require("../utilities/messages/toaster.messages");
const DateTimeService = require("./date-time/date-time.service");
const EmailService = require("./email/email.service");
const PaymentService = require("./payment/payment.service");

class BillingService {

    book = async ({ bookingId, paymentId }) => {
        try {

            const bookingDao = await BookingDAO.init();
            const roomBlockRangeDao = await RoomBlockRangeDAO.init();
            const dateTimeService = new DateTimeService();

            await bookingDao.updateById(bookingId, { paymentId: paymentId });
            await bookingDao.updateStatus(bookingId, BillingStatus.PAYMENT_DONE);

            //Now sending message your booking has been done
            const emailTemplate = new EmailTemplate();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: bookingId });

            const blockEndDate = await dateTimeService.subtractDays(order[0].bookingDetails.checkout, 1);
            await roomBlockRangeDao.upsertRange({
                roomId: order[0].roomId, ranges: [{
                    startDate: order[0].bookingDetails.checkin,
                    endDate: blockEndDate,
                    bookingId: order[0]._id
                }]
            });

            //send email to user
            const tenantHtml = await emailTemplate.createTemplate(EMAIL_TEMPLATE.BOOKING_PAYMENT_RECEIVED_TENANT, { order: order[0] });
            const tenantSubject = await emailTemplate.createSubject(EMAIL_TEMPLATE.BOOKING_PAYMENT_RECEIVED_TENANT, { title: order[0].room[0].title });
            emailService.sendMail({ to: order[0].tenant[0].email, subject: tenantSubject, html: tenantHtml });

            // send email to host
            const hostHtml = await emailTemplate.createTemplate(EMAIL_TEMPLATE.NEW_BOOKING_HOST, { order: order[0] });
            const hostSubject = await emailTemplate.createSubject(EMAIL_TEMPLATE.NEW_BOOKING_HOST, { title: order[0].room[0].title });
            emailService.sendMail({ to: order[0].host[0].email, subject: hostSubject, html: hostHtml });

            return;
        } catch (error) {
            throw error;
        }
    }

    checkout = async ({ user, bookingDetails, roomId, hostId }) => {
        try {

            const paymentService = new PaymentService();
            const bookingDao = await BookingDAO.init();
            const roomBlockRangeDao = await RoomBlockRangeDAO.init();
            const dateTimeService = new DateTimeService();

            bookingDetails.checkin = await dateTimeService.setFixedTime(bookingDetails.checkin, BookingTime.CHECK_IN_HOUR, BookingTime.CHECK_IN_MINUTE);
            bookingDetails.checkout = await dateTimeService.setFixedTime(bookingDetails.checkout, BookingTime.CHECK_OUT_HOUR, BookingTime.CHECK_OUT_MINUTE);

            const isRoomAlreadyBooked = await roomBlockRangeDao.isRoomAlreadyBooked({
                roomId,
                checkin: bookingDetails.checkin,
                checkout: bookingDetails.checkout
            });

            if (isRoomAlreadyBooked) {
                return { status: false, message: toaster.ROOM_ALREADY_BOOK, order: null, customer: null }
            }

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
                status: true,
                order: {
                    id: order.id,
                    bookingId: booking._id,
                    amount: bookingDetails.grandTotal
                },
                customer,
                message: ""
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

    confirm = async (billingId, title, tenantName) => {
        try {

            const bookingDao = await BookingDAO.init();

            const emailTemplate = new EmailTemplate();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: billingId });
            const isBookingCancelled = [
                BillingStatus.BOOKING_CANCELLED,
                BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED,
                BillingStatus.REFUND_BY_USER_INITIATED,
                BillingStatus.REFUND_BY_HOST_INITIATED,
                BillingStatus.REFUND_BY_HOST_PROCEDDED,
                BillingStatus.REFUND_PARTIAL_BY_USER_PROCEDDED,
                BillingStatus.REFUND_BY_USER_PROCEDDED
            ].includes(order[0].status)

            if (isBookingCancelled) {
                return { status: false, message: toaster.BOOKING_ALREADY_CANCELLED };
            }

            const html = await emailTemplate.createTemplate(EMAIL_TEMPLATE.ROOM_CONFIRMED, { order: order[0] });
            const subject = await emailTemplate.createSubject(EMAIL_TEMPLATE.ROOM_CONFIRMED, { title });

            await bookingDao.updateStatus(billingId, BillingStatus.CONFIRMED);
            emailService.sendMail({ to: order[0].tenant[0].email, subject, html });

            return { status: true, message: toaster.ROOM_CONFIRMED(title, tenantName) }
        } catch (error) {
            throw error;
        }
    }

    cancelByHost = async (billingId, title, tenantName) => {
        try {

            const bookingDao = await BookingDAO.init();
            const roomBlockRangeDao = await RoomBlockRangeDAO.init();
            const refundDao = await RefundDAO.init();

            const paymentService = new PaymentService();
            const order = await bookingDao.getBookingDetailById({ _id: billingId });

            const isBookingCancelled = [
                BillingStatus.BOOKING_CANCELLED,
                BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED,
                BillingStatus.REFUND_BY_USER_INITIATED,
                BillingStatus.REFUND_BY_HOST_INITIATED,
                BillingStatus.REFUND_BY_HOST_PROCEDDED,
                BillingStatus.REFUND_PARTIAL_BY_USER_PROCEDDED,
                BillingStatus.REFUND_BY_USER_PROCEDDED
            ].includes(order[0].status)

            if (isBookingCancelled) {
                return { status: false, message: toaster.BOOKING_ALREADY_CANCELLED };
            }

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

            await roomBlockRangeDao.removeRangeByBookingId({ roomId: order[0].roomId, bookingId: order[0]._id });

            return { status: true, message: toaster.ROOM_CANCELLED(title, tenantName) }
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
            const refundDao = await RefundDAO.init();
            const roomBlockRangeDao = await RoomBlockRangeDAO.init();

            const paymentService = new PaymentService();
            const emailTemplate = new EmailTemplate();
            const emailService = new EmailService();

            const order = await bookingDao.getBookingDetailById({ _id: billingId });

            const isBookingCancelled = [
                BillingStatus.BOOKING_CANCELLED,
                BillingStatus.REFUND_PARTIAL_BY_USER_INITIATED,
                BillingStatus.REFUND_BY_USER_INITIATED,
                BillingStatus.REFUND_BY_HOST_INITIATED,
                BillingStatus.REFUND_BY_HOST_PROCEDDED,
                BillingStatus.REFUND_PARTIAL_BY_USER_PROCEDDED,
                BillingStatus.REFUND_BY_USER_PROCEDDED
            ].includes(order[0].status)

            if (isBookingCancelled) {
                return { status: false, message: toaster.BOOKING_ALREADY_CANCELLED };
            }

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
                        (bookingDetails.teenRate * bookingDetails.teenCount) +
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
                    refund = {
                        id: null,
                        amount: refundAmount,
                        status: "processed"
                    }
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
            });

            await roomBlockRangeDao.removeRangeByBookingId({ roomId: order[0].roomId, bookingId: order[0]._id });

            if (refundStatus == RefundStatus.NO_REFUND) {
                const tenantHtml = await emailTemplate.createTemplate(userTemplateType, { order: order[0], refundAmount: refund.amount });
                const tenantSubject = await emailTemplate.createSubject(userTemplateType, { title: order[0].room[0].title });
                emailService.sendMail({ to: order[0].tenant[0].email, subject: tenantSubject, html: tenantHtml });

                // send email to host
                const hostHtml = await emailTemplate.createTemplate(hostTemplateType, { order: order[0], refundAmount: refund.amount });
                const hostSubject = `Booking Cancelled by Tenant: ${order[0].room[0].title}`;
                emailService.sendMail({ to: order[0].host[0].email, subject: hostSubject, html: hostHtml });
            }

            return { status: true, message: toaster.ROOM_CANCELLED_BY_TENANT };
        } catch (error) {
            throw error;
        }
    };

    updateStatus = async ({ billingId, status, roomId }) => {
        try {

            const bookingDao = await BookingDAO.init();
            await bookingDao.updateStatus(billingId, status);

            if (status == BillingStatus.CHECK_OUT) {
                const roomBlockRangeDao = await RoomBlockRangeDAO.init();
                await roomBlockRangeDao.removeRangeByBookingId({ roomId: roomId, bookingId: billingId });
            }

        } catch (error) {
            throw error;
        }
    }
}

module.exports = BillingService;