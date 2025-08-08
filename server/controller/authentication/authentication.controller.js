const OtpVerificationDAO = require("../../dao/otp-verification.dao");
const EmailTemplate = require("../../helper/email-template.helper");
const DateTimeService = require("../../services/date-time/date-time.service");
const EmailService = require("../../services/email/email.service");
const OTPService = require("../../services/authentication/otp.service");
const { EMAIL_TEMPLATE } = require("../../utilities/constants/email-template.constant");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");
const UserService = require("../../services/user/user.service");
const JWTToken = require("../../services/authentication/JwtToken.service");

class AuthenticationController {
  sendOtp = async (req, res) => {
    try {

      const { email } = req.body;

      const otpService = new OTPService();
      const emailTemplate = new EmailTemplate();
      const emailService = new EmailService();
      const otpVerificationDAO = await OtpVerificationDAO.init();

      const otp = await otpService.generateOtp();
      const expiredTime = await otpService.expiredTime();

      const html = await emailTemplate.createTemplate(EMAIL_TEMPLATE.OTP_SEND, { email, otp, expiredTime });
      const subject = await emailTemplate.createSubject(EMAIL_TEMPLATE.OTP_SEND);

      await emailService.sendMail({ to: email, subject, html });
      await otpVerificationDAO.upsertOtp(email, otp, expiredTime)

      res.status(httpStatus.OK).json({ status: true, message: toaster.SEND_OTP });
    } catch (error) {
      console.error("Error in sendOtp:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
      });
    }
  };
  verifyOtp = async (req, res) => {
    try {

      const { email, otp } = req.body;

      const otpVerificationDAO = await OtpVerificationDAO.init();
      const dateTime = new DateTimeService();

      const validOtp = await otpVerificationDAO.findValidOtp(email, otp, dateTime.getCurrentTime());
      if (!validOtp) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: toaster.INVALID_OTP })
      }

      await otpVerificationDAO.markOtpAsVerified(email, otp);
      return res.status(httpStatus.OK).json({ status: true, message: toaster.VERIFIED_OTP })
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
      });
    }
  };
  registerUser = async (req, res) => {
    try {
      const { firstName, lastName, email, password, userType } = req.body;

      const userService = new UserService();

      const isUserExist = await userService.findUserByEmail({ email, userType });
      if (isUserExist) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: false, message: toaster.EMAIL_EXIST });
      }

      await userService.createUser({ firstName, lastName, email, password, userType });
      return res.status(httpStatus.OK).json({ status: true, message: toaster.USER_REGISTER });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
      });
    }
  }
  login = async (req, res) => {
    try {

      const { email, password, userType } = req.body;
      const userService = new UserService();

      const { token, status, message, httpStatus, user } = await userService.login({ email, password, userType });
      console.log("user: ", user);
      return res.status(httpStatus).json({ status: status, message: message, token, user: user, userType });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
      });
    }

  }

}

module.exports = new AuthenticationController();