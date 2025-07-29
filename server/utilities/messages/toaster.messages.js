const common = {
    SEND: "has been sent successfully",
};

module.exports.toaster = {
    SEND_OTP: `OTP ${common.SEND} to your email`,
    SEND_EMAIL: `Email ${common.SEND}`,
    PASSWORD_RESET: `Password reset link ${common.SEND}`,
    INVALID_OTP: `Otp is not valid`,
    VERIFIED_OTP: 'OTP has been successfully verified',
    EMAIL_EXIST: "Email Already Exist",
    USER_REGISTER: "You’ve successfully registered your account.",
    NOT_ACCOUNT_FOUND: "Account not found. Try a different email or sign up.",
    LOGIN_SUCCESSFULLY: "You’ve logged in successfully!",
    INVALID_CREDENTIAL: "Invalid email or password.Please try again.",
    BOOKING_SUCCESS: " Congratulations! Your booking is confirmed.",
    INTERNAL_SERVER_ERROR: "Something went wrong on our end. Please try again later."
};
