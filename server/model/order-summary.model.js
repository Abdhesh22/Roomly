// models/billing-summary.model.js
module.exports = (mongoose) => {

    const { Schema } = mongoose;
    const ItemSchema = new Schema({
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    });

    const OrderSummary = new Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            roomId: {
                type: String,
                // ref: 'rooms',
                required: true
            },
            basePricePerNight: {
                type: Number,
                required: true
            },
            nightCount: {
                type: Number,
                required: true
            },
            roomCost: {
                type: Number,
                required: true
            },
            extraCharges: {
                type: Number,
                default: 0
            },
            gstRate: {
                type: Number,
                required: true
            },
            gstAmount: {
                type: Number,
                required: true
            },
            grandTotal: {
                type: Number,
                required: true
            },
            status: {
                type: Number,
                required: true
            },
            paymentId: {
                type: String
            },
            items: [ItemSchema]
        },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn"
            }
        }
    );

    return OrderSummary;
};
