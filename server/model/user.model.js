module.exports = (mongoose) => {
  const { Schema } = mongoose;
  return new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        require: true,
      },
      userType: {
        type: Number,
        require: true,
      },
      isEmailVerified: {
        type: Boolean,
      },
    },
    {
      timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" },
    }
  );
};
