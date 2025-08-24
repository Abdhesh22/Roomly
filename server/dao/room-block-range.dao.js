const path = require("path");
const dbConnection = require("../connection/db.connection.js");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "room-block-range.model.js"));

class RoomBlockRangeDAO extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["roomBlockRange"] || mongoose.model("roomBlockRange", schema);
        super(model);
    }
    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new RoomBlockRangeDAO(mongoose);
    }


    async upsertRange({ roomId, ranges }) {
        try {
            return await this.model.findOneAndUpdate(
                { roomId },
                {
                    $push: { ranges: { $each: ranges } }
                },
                { new: true, upsert: true }
            );
        } catch (err) {
            throw err;
        }
    }

    async removeRangeByBookingId({ roomId, bookingId }) {
        try {
            const result = await this.model.findOneAndUpdate(
                { roomId },
                { $pull: { ranges: { bookingId } } },
                { new: true }
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    isRoomAlreadyBooked = async ({ roomId, checkin, checkout }) => {
        const overlap = await this.model.findOne({
            roomId,
            ranges: {
                $elemMatch: {
                    startDate: { $lt: checkout },
                    endDate: { $gt: checkin }
                }
            }
        });

        return overlap;
    };


}

module.exports = RoomBlockRangeDAO;
