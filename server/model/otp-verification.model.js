module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const OtpVerification = new Schema(
        {
            email: {
                type: String,
                required: true,
                unique: true, // optional but recommended
                lowercase: true, // optional: normalize email
                trim: true,      // optional: remove whitespace
            },
            isVerified: {
                type: Boolean,
                required: true,
                default: false, // optional: good practice
            },
            expiredAt: {
                type: Date, // should be a Date, not Boolean
                default: null,
            },
            otp: {
                type: Number,
                required: true
            }
        },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn",
            },
        }
    );

    return OtpVerification;
};
