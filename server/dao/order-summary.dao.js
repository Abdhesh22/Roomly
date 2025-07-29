const path = require("path");
const dbConnection = require("../connection/db.connection");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "order-summary.model.js"));

class OrderSummaryDAO extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["order-summary"] || mongoose.model("order-summary", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new OrderSummaryDAO(mongoose);
    }
}

module.exports = OrderSummaryDAO;