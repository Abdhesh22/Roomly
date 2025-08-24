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

    hostRoomList = async (hostId, params = {}) => {
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
                    guests: "$occupancy.guest",
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

    hostRoomListLength = async (hostId, params) => {

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
                        { $project: { firstName: 1, lastName: 1, email: 1, _id: 0, profileAttachment: 1 } }
                    ],
                    as: "host"
                }
            }
        ])
    }


    userRoomList = async (params = {}) => {
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

        return await this.model.aggregate([
            {
                $match: {
                    status: { $in: ['ACTIVE'] },
                    ...searchCondition
                },
            },
            ...pagination,
            {
                $lookup: {
                    from: "users",
                    let: { hostId: "$hostId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$hostId"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1, _id: 0, createdOn: 1 } }
                    ],
                    as: "host"
                }
            },
            {
                $project: {
                    image: { $arrayElemAt: ["$attachments", 0] },
                    description: 1,
                    createdOn: 1,
                    host: 1,
                    location: 1,
                    title: 1,
                    price: 1,
                    type: 1
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]);
    };

}

module.exports = RoomDao;