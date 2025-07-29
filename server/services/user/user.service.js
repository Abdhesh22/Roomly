const UserDAO = require("../../dao/user.dao");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");
const HashingService = require("../authentication/hashing.service");
const JWTToken = require("../authentication/JwtToken.service");

class UserService {

    findUserByEmail = async ({ email, userType }) => {
        try {
            console.log("userType: ", userType);
            const userDao = await UserDAO.init();
            return await userDao.findOne({ email: email, userType: userType });
        } catch (error) {
            console.log("error: ", error);
            throw error;
        }
    }

    createUser = async ({ firstName, lastName, email, password, userType }) => {
        try {

            const hashingService = new HashingService();
            const userDao = await UserDAO.init();

            password = await hashingService.hash(password);

            return await userDao.create({
                firstName,
                lastName,
                email,
                password,
                isEmailVerified: true,
                userType
            });
        } catch (error) {
            throw error;
        }
    }

    login = async ({ email, password, userType }) => {
        try {

            const hashingService = new HashingService();
            const userDao = await UserDAO.init();

            const user = await userDao.findOne({ email: email, userType: userType });
            if (!user) {
                return { httpStatus: httpStatus.FORBIDDEN, status: false, message: toaster.NOT_ACCOUNT_FOUND, token: false, user: null }
            }

            const isMatched = await hashingService.compare(password, user.password)
            if (!isMatched) {
                return { httpStatus: httpStatus.FORBIDDEN, status: false, message: toaster.INVALID_CREDENTIAL, token: false, user: null }
            }

            const jwtToken = new JWTToken();
            const token = await jwtToken.generateToken({ _id: user._id });

            return { httpStatus: httpStatus.OK, status: true, message: toaster.LOGIN_SUCCESSFULLY, token, user };
        } catch (error) {
            throw error;
        }

    }

    findById = async (id) => {
        const userDao = await UserDAO.init();
        return await userDao.findById(id).lean();
    }

}

module.exports = UserService;