const CommonService = require("../../services/common/common.service");
const Logger = require("../../services/logger.service");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");

class CommonController {
    getStates = async (req, res) => {
        try {

            const commonService = new CommonService();
            const states = await commonService.getStates();

            res.status(httpStatus.OK).json({ status: true, list: states });
        } catch (error) {
            Logger.error('Error in getStates', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

    getCities = async (req, res) => {
        try {

            const params = req.params;
            const commonService = new CommonService();
            const cities = await commonService.getCities(params);

            res.status(httpStatus.OK).json({ status: true, list: cities });
        } catch (error) {
            Logger.error('Error in getCities', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

    getAmenities = async (req, res) => {
        try {

            const commonService = new CommonService();
            const amenities = await commonService.getAmenities();

            res.status(httpStatus.OK).json({ status: true, list: amenities });
        } catch (error) {
            Logger.error('Error in getAmenities', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }

    getPing = async (req, res) => {
        try {
            res.status(httpStatus.OK).json({ status: true, message: "Server is Alive" });
        } catch (error) {
            Logger.error('Error in getPing', error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
            });
        }
    }
}

module.exports = new CommonController();