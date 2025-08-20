module.exports = (mongoose) => {
    const { Schema } = mongoose;
    const StatusTimelineSchema = new Schema(
        {
            status: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        },
        { _id: false }
    );
    const BookingSchema = new Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            roomId: {
                type: Schema.Types.ObjectId,
                ref: 'rooms',
                required: true
            },
            hostId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            bookingDetails: {
                type: Schema.Types.Mixed
            },
            billingId: {
                type: String
            },
            status: {
                type: Number
            },
            receipt: {
                type: String
            },
            paymentId: {
                type: String
            },
            timeline: [StatusTimelineSchema]
        },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn"
            }
        }
    );

    return BookingSchema;
};