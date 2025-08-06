module.exports = (mongoose) => {
    const { Schema } = mongoose;
    const CitySchema = new Schema({
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
        label: {
            type: String,
            required: true
        },
        stateCode: {
            type: String,
            required: true
        }
    },
        {
            timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn"
            }
        }
    );

    return CitySchema;
};