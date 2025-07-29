module.exports = (mongoose) => {
    const { Schema } = mongoose;
    const PaymentMethod = new Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            type: {
                type: String,
                enum: ['card', 'upi', 'netbanking', 'wallet'],
                required: true
            },
            details: {
                last4: { type: String },
                network: { type: String },
                expiry: { type: String },
                vpa: { type: String },
                bank: { type: String }
            },
            paymentGatewayType: {
                type: String,
                enum: ['razorpay', 'stripe', 'paypal'],
                required: true
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        },
        {
            timestamps: {
                createdAt: 'createdOn',
                updatedAt: 'updatedOn'
            }
        }
    );

    return PaymentMethod;
}