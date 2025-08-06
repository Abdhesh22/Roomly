const cloudinary = require("cloudinary").v2;

class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    privateUpload = async (path, folder) => {
        if (!folder) {
            throw new Error("Cloudinary Upload Error: 'folder' is required.");
        }
        try {
            return await cloudinary.uploader.upload(path, {
                folder: folder
            });
        } catch (err) {
            console.error("Cloudinary Upload Error:", err.message);
            throw err;
        }
    };

    privateUrl = async (path, options) => {
        return await cloudinary.url(path, options);
    }

    destroy = async (publicId) => {
        return await cloudinary.uploader.destroy(publicId);
    }

}

module.exports = CloudinaryService;