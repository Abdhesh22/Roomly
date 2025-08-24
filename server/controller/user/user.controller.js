const UserService = require("../../services/user.service");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");

class UserController {
  checkEmail = async (req, res) => {
    try {

      const { userType } = req.query;
      const { email } = req.params;
      const userService = new UserService();

      const isEmailExist = await userService.findUserByEmail({ email, userType });
      if (isEmailExist) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: false, isEmailExist: true, message: toaster.EMAIL_EXIST });
      }

      return res.status(httpStatus.OK).json({ status: true, isEmailExist: false });
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  fetchUser = async (req, res) => {
    try {
      const userService = new UserService();
      const user = await userService.getUserProfile(req.user._id);
      return res.status(httpStatus.OK).json({ status: true, user: user });
    } catch (error) {
      console.log("error: ", error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  updateUser = async (req, res) => {
    try {

      const userService = new UserService();
      const data = req.body;
      const file = req.file;
      const user = await userService.updateUserProfile(req.user._id, data, file);

      return res.status(httpStatus.OK).json({ status: true, user });
    } catch (error) {
      console.log("error: ", error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  changePassword = async (req, res) => {
    try {

      const { passwordData } = req.body;
      const userService = new UserService();
      const { status, message } = await userService.changePassword(req.user._id, passwordData);

      return res.status(httpStatus.OK).json({ status, message });
    } catch (error) {
      console.log("error:", error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

  changeEmail = async (req, res) => {
    try {

      const { email } = req.body;

      const userService = new UserService();
      const user = await userService.changeEmail(req.user._id, email);

      return res.status(httpStatus.OK).json({ status: true, message: toaster.EMAIL_CHANGED, user });
    } catch (error) {
      console.log("error:", error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false });
    }
  }

}
module.exports = new UserController();
