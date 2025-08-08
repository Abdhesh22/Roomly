module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const AttachmentSchema = new Schema({
        originalFileName: { type: String, required: true },
        remotePath: { type: String, required: true },
        remoteId: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true }
    });

    const RoomSchema = new Schema(
        {
            title: {
                type: String,
            },
            roomNo: {
                type: Number,
            },
            description: {
                type: String,
            },
            hostId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            type: {
                type: String,
                required: true,
            },
            location: {
                state: { type: String, required: true },
                city: { type: String, required: true },
                pincode: { type: String, required: true },
                latitude: { type: String, required: true },
                longitude: { type: String, required: true }
            },
            price: {
                base: { type: String, required: true },
                guest: { type: String, required: true },
                pet: { type: String, required: true },
            },
            occupancy: {
                guest: { type: Number, required: true },
                bed: { type: Number, required: true },
                pet: { type: Number, required: true },
                bath: { type: Number, required: true },
                bedRoom: { type: Number, required: true }
            },
            amenities: {
                type: [String],
                default: []
            },
            status: {
                type: String,
                enum: ["ACTIVE", "BOOKED", "DELETE", "MAINTENANCE"],
                default: "ACTIVE"
            },
            attachments: [AttachmentSchema]
        },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn"
            }
        }
    );

    return RoomSchema;
};