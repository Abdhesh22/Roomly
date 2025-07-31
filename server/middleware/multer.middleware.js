const multer = require("multer");
const path = require("path");
const fs = require("fs");

class MulterMiddleware {
    #uploadDir;
    #multerInstance;

    constructor() {
        this.#uploadDir = path.join(__dirname, "../uploads");

        if (!fs.existsSync(this.#uploadDir)) {
            fs.mkdirSync(this.#uploadDir, { recursive: true });
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.#uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        });

        const fileFilter = (req, file, cb) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Only image files are allowed."), false);
            }
        };

        this.#multerInstance = multer({
            storage,
            fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        });
    }

    /**
     * Use this for single image upload: field name must be 'image'
     */
    single(fieldName = "image") {
        return this.#multerInstance.single(fieldName);
    }

    /**
     * Use this for multiple image uploads: field name must be 'images'
     */
    multiple(fieldName = "images", maxCount = 10) {
        console.log("runnig");
        return this.#multerInstance.array(fieldName, maxCount);
    }
}

module.exports = new MulterMiddleware();
