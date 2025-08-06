const AmenityDAO = require("../../dao/amenity.dao");
const CityDAO = require("../../dao/city.dao");
const StateDAO = require("../../dao/state.dao");

class CommonService {
    getStates = async () => {
        try {
            const stateDao = await StateDAO.init();
            return await stateDao.aggregate([{
                $project: {
                    _id: 0,
                    value: "$code",
                    label: 1,
                }
            }]);
        } catch (error) {
            throw error;
        }
    }

    getCities = async (params) => {
        try {

            let matchCondtion = [];

            if (params?.stateCode) {
                matchCondtion = [
                    {
                        $match: {
                            stateCode: params.stateCode
                        }
                    }
                ]
            }

            const cityDao = await CityDAO.init();
            return await cityDao.aggregate([
                ...matchCondtion,
                {
                    $project: {
                        _id: 0,
                        value: 1,
                        label: 1
                    }
                }]);
        } catch (error) {
            throw error;
        }
    }

    getAmenities = async () => {
        try {
            const amenityDao = await AmenityDAO.init();
            return await amenityDao.aggregate([
                {
                    $project: {
                        _id: 0,
                        value: 1,
                        label: 1,
                        icon: 1,
                        tagline: 1
                    }
                }
            ]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CommonService;