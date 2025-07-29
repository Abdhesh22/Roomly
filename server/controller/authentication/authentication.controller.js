const OtpVerificationDAO = require("../../dao/otp-verification.dao");
const EmailTemplate = require("../../helper/email-template.helper");
const DateTime = require("../../services/date-time/date-time.service");
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
      console.log("email: ", email);
      const otpVerificationDAO = await OtpVerificationDAO.init();
      const dateTime = new DateTime();

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

      const { email, password, userType } = req.query;
      const userService = new UserService();

      const { token, status, message, httpStatus, user } = await userService.login({ email, password, userType });
      return res.status(httpStatus).json({ status: status, message: message, token, user: user, userType });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: toaster.INTERNAL_SERVER_ERROR || "Something went wrong"
      });
    }

  }
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

module.exports = new AuthenticationController();