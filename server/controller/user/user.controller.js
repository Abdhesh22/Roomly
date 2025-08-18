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
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true });
    }
  }

}
module.exports = new UserController();
