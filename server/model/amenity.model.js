module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const AmenitySchema = new Schema(
        {
            id: {
                type: Number,
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
            icon: {
                type: String,
                required: true
            },
            tagline: {
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

    return AmenitySchema;
};