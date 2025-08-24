module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const RefundSchema = new Schema(
        {
            refundId: {
                type: String,
                index: true,
            },
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Bookings",
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            type: {
                type: Number
            },
            status: {
                type: String,
                enum: [
                    "initiated",
                    "processing",
                    "processed",
                    "failed",
                ],
                required: true,
            },
            reason: {
                type: String,
                default: null,
            }
        },
        {
            timestamps: {
                createdAt: 'createdOn',
                updatedAt: 'updatedOn'
            }
        }
    );

    return RefundSchema;
}