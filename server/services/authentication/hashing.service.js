const bcrypt = require("bcrypt");

class HashingService {
    constructor() {
        this.saltRounds = 10; // You can increase this for more security (with performance tradeoff)
    }

    /**
     * Hashes the provided plain text using bcrypt.
     * @param {string} plainText - The text to hash (usually a password).
     * @returns {Promise<string>} - The hashed string.
     */
    async hash(plainText) {
        if (!plainText) throw new Error("No input provided for hashing.");
        return await bcrypt.hash(plainText, this.saltRounds);
    }

    /**
     * Compares a plain text with a hashed value.
     * @param {string} plainText - The text to verify.
     * @param {string} hashedText - The hashed value to compare against.
     * @returns {Promise<boolean>} - True if matched, false otherwise.
     */
    async compare(plainText, hashedText) {
        if (!plainText || !hashedText) throw new Error("Missing input for comparison.");
        return await bcrypt.compare(plainText, hashedText);
    }
}

module.exports = HashingService;
