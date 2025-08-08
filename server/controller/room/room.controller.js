const OrderSummaryDAO = require("../../dao/order-summary.dao");
const RoomService = require("../../services/room/room.service");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { Status } = require("../../utilities/constants/status.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");

class RoomController {
    book = async (req, res) => {
        try {

            const { orderSummaryId, paymentId } = req.body;
            const orderSummaryDao = await OrderSummaryDAO.init();

            await orderSummaryDao.updateById(orderSummaryId, { status: Status.COMPLETE, paymentId: paymentId });
            return res.status(httpStatus.OK).json({ status: true, message: toaster.BOOKING_SUCCESS });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    create = async (req, res) => {
        try {

            const hostId = req.user._id;
            const data = req.body;
            const files = req.files;

            const roomService = new RoomService();
            await roomService.create(hostId, data, files);

            return res.status(httpStatus.OK).json({ status: true, message: toaster.ROOM_CREATED });
        } catch (error) {
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }


    hostRoomList = async (req, res) => {
        try {

            const hostId = req.user._id;
            const params = req.query;

            const roomService = new RoomService();
            const { list, length } = await roomService.hostRoomList(hostId, params);

            return res.status(httpStatus.OK).json({ status: true, list, length });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    updateStatus = async (req, res) => {
        try {
            const { roomId, status } = req.params;
            const roomService = new RoomService();
            const message = await roomService.updateStatus(roomId, status);
            return res.status(httpStatus.OK).json({ status: true, message: message });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    getRoomDetails = async (req, res) => {
        try {

            const { roomId } = req.params;

            const roomService = new RoomService();
            const room = await roomService.getRoomDetails(roomId);

            return res.status(httpStatus.OK).json({ status: true, room });
        } catch (error) {
            console.log("error: ", error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    update = async (req, res) => {
        try {

            const { roomId } = req.params;
            const hostId = req.user._id;
            const data = req.body;
            const files = req.files;

            const roomService = new RoomService();
            await roomService.update(hostId, roomId, data, files);
            return res.status(httpStatus.OK).json({ status: true });
        } catch (error) {
            console.log("error: ", error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

    userRoomGrid = async (req, res) => {
        try {

            const query = req.query;

            const roomService = new RoomService();
            const list = await roomService.userRoomGrid(query);

            return res.status(httpStatus.OK).json({ status: true, list });
        } catch (error) {
            console.log(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }

}

module.exports = new RoomController();