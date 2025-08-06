const path = require("path");
const dbConnection = require("../connection/db.connection");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "room.model.js"));
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

class RoomDao extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["room"] || mongoose.model("room", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new RoomDao(mongoose);
    }

    myRoomsList = async (hostId, params = {}) => {
        const pagination = [];
        if (params.skip) {
            pagination.push(
                {
                    $skip: (parseInt(params.skip) - 1) * parseInt(params.limit),
                },
                {
                    $limit: parseInt(params.limit),
                },
            )
        }


        let searchCondition = {};
        if (params.searchKey) {
            const searchKey = params.searchKey;
            searchCondition = {
                $or: [
                    { title: { $regex: searchKey, $options: 'i' } },
                    { 'location.city': { $regex: searchKey, $options: 'i' } },
                    { 'location.state': { $regex: searchKey, $options: 'i' } },
                    { 'location.pincode': { $regex: searchKey, $options: 'i' } }
                ]
            };
        }


        console.log("[params.sortKey]: params.order == 'asc' ? 1 : -1: ", { [params.sortKey]: params.order == 'asc' ? 1 : -1 });

        return await this.model.aggregate([
            {
                $match: {
                    hostId: hostId,
                    status: { $in: ['ACTIVE', 'MAINTENANCE'] },
                    ...searchCondition
                },
            },
            ...pagination,
            {
                $project: {
                    _id: 1,
                    title: 1,
                    city: "$location.city",
                    state: "$location.state",
                    pincode: "$location.pincode",
                    price: "$price.base",
                    guests: "$occupancy.guests",
                    status: 1,
                },
            },
            {
                $sort: {
                    [params.sortKey]: params.order == 'asc' ? 1 : -1
                }
            }
        ]);
    };

    myRoomsListCount = async (hostId, params) => {

        let searchCondition = {};
        if (params.searchKey) {
            const searchKey = params.searchKey;
            searchCondition = {
                $or: [
                    { title: { $regex: searchKey, $options: 'i' } },
                    { 'location.city': { $regex: searchKey, $options: 'i' } },
                    { 'location.state': { $regex: searchKey, $options: 'i' } },
                    { 'location.pincode': { $regex: searchKey, $options: 'i' } }
                ]
            };
        }

        const result = await this.model.aggregate([
            {
                $match: {
                    hostId: hostId,
                    status: { $in: ['ACTIVE', 'MAINTENANCE'] },
                    ...searchCondition
                },
            },
        ])
        return result.length;
    }

    getRoomDetails = async (roomId) => {
        return await this.model.aggregate([
            {
                $match: {
                    _id: new ObjectId(roomId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { hostId: "$hostId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$hostId"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1, _id: 0 } }
                    ],
                    as: "host"
                }
            }
        ])
    }

}

module.exports = RoomDao;