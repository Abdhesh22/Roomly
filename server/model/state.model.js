module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const StateSchema = new Schema({
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        countyCode: {
            type: String,
            required: true
        }
    }, {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn"
        }
    });

    return StateSchema;
};
