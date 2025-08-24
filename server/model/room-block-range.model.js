module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const BlockedRangeSchema = new mongoose.Schema({
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        bookingId: {
            type: Schema.Types.ObjectId
        }
    }, { _id: false });

    const RoomBlockRangeSchema = new Schema(
        {
            roomId: {
                type: Schema.Types.ObjectId,
                ref: 'rooms',
                required: true
            },
            ranges: [BlockedRangeSchema]
        },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn"
            }
        }
    );

    return RoomBlockRangeSchema;
};