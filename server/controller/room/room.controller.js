const OrderSummaryDAO = require("../../dao/order-summary.dao");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { Status } = require("../../utilities/constants/status.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");

class RoomController {
    booking = async (req, res) => {
        try {

            const { orderSummaryId, paymentId } = req.body;
            const orderSummaryDao = await OrderSummaryDAO.init();

            await orderSummaryDao.updateById(orderSummaryId, { status: Status.COMPLETE, paymentId: paymentId });
            return res.status(httpStatus.OK).json({ status: true, message: toaster.BOOKING_SUCCESS });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true, message: toaster.INTERNAL_SERVER_ERROR });
        }
    }
}

module.exports = new RoomController();