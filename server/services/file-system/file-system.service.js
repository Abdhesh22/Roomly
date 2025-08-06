const CloudinaryService = require("./cloudinary.service");
const fs = require("fs");

class FileSystemService {
    #cloudinaryInstance;

    constructor() {
        this.#cloudinaryInstance = new CloudinaryService();
    }

    unlinkFiles = async (paths) => {
        for (const path of paths) {
            try {
                await fs.unlink(path);
            } catch (err) {
                console.warn(`Failed to delete file: ${path}`, err.message);
            }
        }
    };

    async privateUpload(files, folder) {

        const paths = [];
        const attachments = [];

        for (let i = 0; i < files.length; i++) {

            const file = files[i];
            const result = await this.#cloudinaryInstance.privateUpload(file.path, folder);

            attachments.push({
                originalFileName: file.originalname,
                remotePath: result.secure_url,
                remoteId: result.public_id,
                mimetype: file.mimetype,
                size: file.size
            });

            paths.push(file.path);

        }

        await this.unlinkFiles(paths);
        return attachments;
    }

    getPrivateLink = async (attachment, expiredAt) => {
        try {
            return await this.#cloudinaryInstance.privateUrl(attachment.remoteId, {
                type: "authenticated",
                sign_url: true,
                secure: true,
                expires_at: expiredAt,
            });
        } catch (error) {
            throw error;
        }
    }

    async getFilesPrivateLink(attachments, expiredAt) {
        try {
            const files = [];

            for (let i = 0; i < attachments.length; i++) {
                const url = await this.getPrivateLink(attachments[i], expiredAt);
                files.push({
                    originalFileName: attachments[i].originalFileName,
                    url: url
                })
            }

            return files;
        } catch (error) {
            throw error;
        }
    }

    deleteFile = async (file) => {
        return this.#cloudinaryInstance.destroy(file.remoteId);
    }

    deleteFiles = async (files) => {
        try {

            const deletedFiles = [];

            for (let i = 0; i < files.length; i++) {
                await this.deleteFile(files[i]);
                deletedFiles.push(files[i])
            }

            return deletedFiles;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FileSystemService;
