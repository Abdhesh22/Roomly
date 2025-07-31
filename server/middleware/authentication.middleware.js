const JWTToken = require("../services/authentication/JwtToken.service");
const UserService = require("../services/user/user.service");
const { httpStatus } = require("../utilities/constants/httpstatus.constant");

class AuthenticationMiddleware {
    verify = async (req, res, next) => {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                return res.status(httpStatus.UNAUTHORIZED).json({ message: "Authorization header missing" });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(httpStatus.UNAUTHORIZED).json({ message: "Token missing" });
            }

            const jwtToken = new JWTToken();
            const decoded = await jwtToken.verifyToken(token); // Should throw if invalid
            if (!decoded) {
                return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
            }

            const userService = new UserService();
            const user = await userService.findById(decoded._id);
            if (!user) {
                return res.status(httpStatus.UNAUTHORIZED).json({ message: "User not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Invalid token", error: error.message });
        }
    };
}

module.exports = new AuthenticationMiddleware();