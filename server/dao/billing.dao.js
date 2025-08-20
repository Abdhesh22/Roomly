const path = require("path");
const dbConnection = require("../connection/db.connection.js");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "billing.model.js"));
const mongoose = require("mongoose");
const { orderStatusOptions, BillingStatus } = require("../utilities/constants/order-status.constant.js");
const { ObjectId } = mongoose.Types;
class BookingDAO extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["booking"] || mongoose.model("booking", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new BookingDAO(mongoose);
    }

    getHostBooking = async (params) => {

        let matchCondtion = {
            hostId: params.hostId,
        }

        if (params.status != orderStatusOptions.ALL) {
            matchCondtion.status = await this.#fetchStatusCondition(params.status)
        }

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
                $match: matchCondtion
            },
            ...pagination,
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1 } }
                    ],
                    as: "tenant"
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    let: { roomId: "$roomId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$roomId"] }, ...searchCondition } },
                        { $project: { title: 1, location: 1 } }
                    ],
                    as: "room"
                }
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: "$room" }, 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    hostId: 1,
                    bookingDetails: 1,
                    tenant: 1,
                    room: 1,
                    createdAt: 1,
                    status: 1,
                    receipt: 1,
                    timeline: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
    }


    getHostBookingLength = async (params) => {

        let matchCondtion = {
            hostId: params.hostId
        }
        if (params.status != orderStatusOptions.ALL) {
            matchCondtion.status = await this.#fetchStatusCondition(params.status)
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

        const result = await this.model.aggregate([
            {
                $match: matchCondtion
            },
            {
                $lookup: {
                    from: "rooms",
                    let: { roomId: "$roomId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$roomId"] }, ...searchCondition } },
                        { $project: { title: 1, location: 1 } }
                    ],
                    as: "room"
                }
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: "$room" }, 0] }
                }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ]);
        return result.length;
    }

    #fetchStatusCondition = (status) => {
        switch (status) {
            case "payment_progress":
                return { $in: [BillingStatus.PAYMENT_IN_PROGRESS] };

            case "payment_done":
                return { $in: [BillingStatus.COMPLETE, BillingStatus.CONFIRMED] };
            // Adjust depending on how you define "done"

            case "complete":
                return { $in: [BillingStatus.COMPLETE] };

            case "confirmed":
                return { $in: [BillingStatus.CONFIRMED] };

            case "refund":
                return {
                    $nin: [
                        BillingStatus.CONFIRMED,
                        BillingStatus.COMPLETE,
                        BillingStatus.PAYMENT_IN_PROGRESS,
                    ],
                };
            default:
                return {};
        }
    };


    bookingForUser = async (params) => {

        let matchCondtion = {
            userId: params.userId,
        }

        if (params.status != orderStatusOptions.ALL) {
            matchCondtion.status = await this.#fetchStatusCondition(params.status)
        }

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
                $match: matchCondtion
            },
            ...pagination,
            {
                $lookup: {
                    from: "rooms",
                    let: { roomId: "$roomId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$roomId"] }, ...searchCondition } },
                        { $project: { title: 1, location: 1, checkin: 1, checkout: 1 } }
                    ],
                    as: "room"
                }
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: "$room" }, 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    hostId: 1,
                    bookingDetails: 1,
                    tenant: 1,
                    room: 1,
                    createdAt: 1,
                    status: 1,
                    receipt: 1,
                    timeline: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);
    }

    bookingForUserLength = async (params) => {

        let matchCondtion = {
            userId: params.userId,
        }

        if (params.status != orderStatusOptions.ALL) {
            matchCondtion.status = await this.#fetchStatusCondition(params.status)
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

        const result = await this.model.aggregate([
            {
                $match: matchCondtion
            },
            {
                $lookup: {
                    from: "rooms",
                    let: { roomId: "$roomId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$roomId"] }, ...searchCondition } },
                        { $project: { title: 1, location: 1, checkin: 1, checkout: 1 } }
                    ],
                    as: "room"
                }
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: "$room" }, 0] }
                }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ]);

        return result.length;
    }

    getBookingDetailById = async (params) => {
        return await this.model.aggregate([
            {
                $match: {
                    _id: new ObjectId(params._id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1 } }
                    ],
                    as: "tenant"
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { hostId: "$hostId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$hostId"] } } },
                        { $project: { firstName: 1, lastName: 1, email: 1 } }
                    ],
                    as: "host"
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    let: { roomId: "$roomId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$roomId"] } } },
                        { $project: { title: 1, location: 1 } }
                    ],
                    as: "room"
                }
            },
            {
                $project: {
                    _id: 1,
                    bookingDetails: 1,
                    tenant: 1,
                    receipt: 1,
                    paymentId: 1,
                    host: 1,
                    room: 1
                }
            }
        ]);
    }

    updateStatus = async (_id, status) => {
        return this.model.updateOne({ _id: new ObjectId(_id) },
            {
                $set: { status: status },
                $push: {
                    timeline: {
                        status,
                        createdAt: new Date()
                    }
                }
            }
        );
    }

}

module.exports = BookingDAO;