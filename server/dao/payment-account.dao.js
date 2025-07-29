const path = require("path");
const dbConnection = require("../connection/db.connection.js");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "payment-account.model.js"));

class PaymentAccountDAO extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["payment-account"] || mongoose.model("payment-account", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new PaymentAccountDAO(mongoose);
    }
}

module.exports = PaymentAccountDAO;