const BillingService = require("../../services/billing.service");
const Logger = require("../../services/logger.service");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");
class BookingController {

    book = async (req, res) => {
        try {

            const { bookingId, paymentId } = req.body;

            const billingService = new BillingService();
            await billingService.book({ bookingId, paymentId });

            return res.status(httpStatus.OK).json({ status: true, message: toaster.BOOKING_SUCCESS });
        } catch (error) {
            Logger.error('Error in book', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    getHostBooking = async (req, res) => {
        try {

            const query = req.query;
            query.hostId = req.user._id;

            const billingService = new BillingService();
            const { list, length } = await billingService.getHostBooking(query);

            return res.status(httpStatus.OK).json({ status: true, list, length });

        } catch (error) {
            Logger.error('Error in getHostBooking', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    confirm = async (req, res) => {
        try {

            const billingService = new BillingService();
            const { billingId, title, tenantName } = req.body;

            const { status, message } = await billingService.confirm(billingId, title, tenantName);

            return res.status(httpStatus.OK).json({ status, message });
        } catch (error) {
            Logger.error('Error in confirm', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    cancelByHost = async (req, res) => {
        try {

            const billingService = new BillingService();
            const { billingId, title, tenantName } = req.body;

            const { status, message } = await billingService.cancelByHost(billingId, title, tenantName);

            return res.status(httpStatus.OK).json({ status, message });
        } catch (error) {
            Logger.error('Error in cancelByHost', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    bookingForUser = async (req, res) => {
        try {

            const billingService = new BillingService();
            const query = req.query;
            query.userId = req.user._id;

            const { list, length } = await billingService.bookingForUser(query);

            return res.status(httpStatus.OK).json({ status: true, list, length });
        } catch (error) {
            Logger.error('Error in bookingForUser', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }


    cancelByUser = async (req, res) => {
        try {

            const billingService = new BillingService();
            const { billingId, refundStatus } = req.body;

            const { status, message } = await billingService.cancelByUser(billingId, refundStatus);

            return res.status(httpStatus.OK).json({ status, message });
        } catch (error) {
            Logger.error('Error in cancelByUser', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }


    checkout = async (req, res) => {
        try {

            const { user } = req;
            const { billing: bookingDetails, roomId, hostId } = req.body;

            const billingService = new BillingService();
            const { order, customer, status, message } = await billingService.checkout({ user, bookingDetails, roomId, hostId });

            return res.status(httpStatus.OK).json({ status, message, order, customer, user });
        } catch (error) {
            Logger.error('Error in checkout', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true });
        }
    }

}

module.exports = new BookingController();