const path = require("path");
const dbConnection = require("../connection/db.connection");
const BaseDAO = require("./base.dao.js");
const getSchema = require(path.join(__dirname, "..", "model", "otp-verification.model.js"));

class OtpVerificationDAO extends BaseDAO {
    constructor(mongoose) {
        const schema = getSchema(mongoose);
        const model = mongoose.models["otp-verification"] || mongoose.model("otp-verification", schema);
        super(model);
    }

    static async init() {
        const mongoose = await dbConnection.getMongoose();
        return new OtpVerificationDAO(mongoose);
    }

    async upsertOtp(email, otp, expiredAt) {
        return this.model.findOneAndUpdate(
            { email },
            { $set: { otp, expiredAt, isVerified: false } },
            { new: true, upsert: true }
        );
    }

    async findValidOtp(email, otp, currentTime) {
        console.log(email)
        console.log(otp);
        console.log(currentTime);
        return this.model.findOne({
            email,
            otp,
            isVerified: false,
            expiredAt: { $gte: currentTime },
        });
    }

    async markOtpAsVerified(email, otp) {
        return this.model.updateOne(
            { email, otp },
            { $set: { isVerified: true } }
        );
    }
}

module.exports = OtpVerificationDAO;