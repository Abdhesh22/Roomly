const path = require("path");
const dbConnection = require("../connection/db.connection");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "payment-method.model.js"));

class PaymentMethod extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["payment-method"] || mongoose.model("payment-method", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new PaymentMethod(mongoose);
    }
}

module.exports = PaymentMethod;