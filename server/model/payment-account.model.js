module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const PaymentAccount = new Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            customerId: {
                type: String,
                required: true
            },
            linkedAccountId: {
                type: String,
                required: false
            }
        },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn",
            },
        }
    );

    return PaymentAccount;
};
