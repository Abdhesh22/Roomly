const jwt = require("jsonwebtoken");

class JWTToken {
    constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.expiresIn = "1h";
    }

    // Generate a token with payload
    generateToken(payload) {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
    }

    // Verify token and return decoded data
    async verifyToken(token) {
        try {
            return await jwt.verify(token, this.secretKey);
        } catch (error) {
            return null; // or throw error
        }
    }

    // Decode token without verifying
    decodeToken(token) {
        return jwt.decode(token);
    }

}

module.exports = JWTToken;