const OTPService = require("../../services/verification/otp.service");

class UserController {
  registerUser = (req, res) => {};
  verifyEmail = async (req, res) => {
    try {
      const { email } = req.body;

      //Generating Otp
      const otpService = new OTPService();
      const otp = await otpService.generateOtp();
      const expiredTime = await otpService.expiredTime();

      //Email Template
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = new UserController();
