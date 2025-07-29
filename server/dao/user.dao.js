const path = require("path");
const dbConnection = require("../connection/db.connection");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "user.model.js"));

class UserDAO extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["user"] || mongoose.model("user", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new UserDAO(mongoose);
    }
}

module.exports = UserDAO;
