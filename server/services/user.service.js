const UserDAO = require("../dao/user.dao");
const { httpStatus } = require("../utilities/constants/httpstatus.constant");
const { toaster } = require("../utilities/messages/toaster.messages");
const HashingService = require("./authentication/hashing.service");
const JWTToken = require("./authentication/JwtToken.service");
const FileSystemService = require("./file-system/file-system.service");

class UserService {

    findUserByEmail = async ({ email, userType }) => {
        try {
            const userDao = await UserDAO.init();
            const query = {
                email: email,
                userType: userType
            };

            return await userDao.findOne(query);
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

    getUserProfile = async (id) => {
        const userDao = await UserDAO.init();
        return await userDao.findById(id, { password: 0 });
    }

    updateUserProfile = async (userId, data, file) => {
        try {
            const fileSystemService = new FileSystemService();
            const userDao = await UserDAO.init();

            const updateUser = {
                firstName: data.firstName,
                lastName: data.lastName
            };

            if (file) {
                updateUser.profileAttachment = await fileSystemService.privateSingleUpload(file, 'user-profile');
            }

            return await userDao.findOneAndUpdate(
                { _id: userId },
                { $set: updateUser },
                { new: true } // <-- return updated document
            );
        } catch (error) {
            throw error;
        }
    };


    changePassword = async (userId, passwordData) => {
        console.log("userId", userId);
        try {

            const userDao = await UserDAO.init();
            const hashingService = new HashingService();

            const user = await userDao.findById(userId, { password: 1 });
            const isMatched = await hashingService.compare(passwordData.currentPassword, user.password);

            if (!isMatched) {
                return { status: false, message: toaster.CURRENT_PASSWORD_INCORRECT }
            }

            const password = await hashingService.hash(passwordData.newPassword);

            await userDao.findOneAndUpdate(
                { _id: userId },
                { $set: { password: password } },
                { new: true }
            );

            return { status: true, message: toaster.PASSWORD_CHANGED }

        } catch (error) {
            throw error;
        }
    }

    changeEmail = async (userId, email) => {
        try {
            const userDao = await UserDAO.init();
            return await userDao.findOneAndUpdate({ _id: userId }, { $set: { email } }, { new: true });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserService;