const BillingService = require("../../services/billing.service");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");

class BookingController {
    getHostBooking = async (req, res) => {
        try {

            const query = req.query;
            query.hostId = req.user._id;

            const billingService = new BillingService();
            const { list, length } = await billingService.getHostBooking(query);

            return res.status(httpStatus.OK).json({ status: true, list, length });

        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    confirm = async (req, res) => {
        try {

            const billingService = new BillingService();
            const { billingId, title, tenantName } = req.body;

            await billingService.confirm(billingId, title);

            return res.status(httpStatus.OK).json({ status: true, message: toaster.ROOM_CONFIRMED(title, tenantName) });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    cancelByHost = async (req, res) => {
        try {

            const billingService = new BillingService();
            const { billingId, title, tenantName } = req.body;

            await billingService.cancelByHost(billingId);

            return res.status(httpStatus.OK).json({ status: true, message: toaster.ROOM_CANCELLED(title, tenantName) });
        } catch (error) {
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
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }


    cancelByUser = async (req, res) => {
        try {

            const billingService = new BillingService();
            const { billingId, refundStatus } = req.body;

            await billingService.cancelByUser(billingId, refundStatus);

            return res.status(httpStatus.OK).json({ status: true, message: "Room Cancelled" });
        } catch (error) {
            console.log("err: ", error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }


    checkout = async (req, res) => {
        try {

            const { user } = req;
            const { billing: bookingDetails, roomId, hostId } = req.body;

            const billingService = new BillingService();
            const { order, customer } = await billingService.checkout({ user, bookingDetails, roomId, hostId });

            return res.status(httpStatus.OK).json({ status: true, isEmailExist: false, order, customer, user });
        } catch (error) {
            console.log("error:", error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true });
        }
    }
}

module.exports = new BookingController();