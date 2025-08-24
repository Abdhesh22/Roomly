module.exports = (mongoose) => {
  const { Schema } = mongoose;
  const AttachmentSchema = new Schema({
    originalFileName: { type: String, required: true },
    remotePath: { type: String, required: true },
    remoteId: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true }
  }, { _id: false });

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
        required: true,
      },
      userType: {
        type: Number,
        required: true,
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      profileAttachment: {
        type: AttachmentSchema,
        default: null,
      },
    },
    {
      timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" },
    }
  );
};