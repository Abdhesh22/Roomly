const { BillingStatusLabels } = require("../constants/booking-status.constant");

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
    INTERNAL_SERVER_ERROR: "Something went wrong on our end. Please try again later.",
    ROOM_CREATED: "Room has been successfully created.",
    ROOM_DELETED: "Room has been successfully deleted.",
    ROOM_ACTIVE: "Room is now active and available for booking.",
    ROOM_MAINTENANCE: "Room has been marked as under maintenance.",
    CURRENT_PASSWORD_INCORRECT: "Your current password is incorrect",
    PASSWORD_CHANGED: "Password changed successfully",
    ROOM_ALREADY_BOOK: "This room is already booked for your selected dates. Please choose different dates.",
    ROOM_CONFIRMED: (title, tenantName) => { return `Room "${title}" has been confirmed and an email has been sent to ${tenantName}.` },
    ROOM_CANCELLED: (title, tenantName) => { return `Room "${title}" has been cancelled and an email has been sent to ${tenantName}.` },
    BOOKING_STATUS: (status) => {
        return `Booking status has been updated to "${BillingStatusLabels[status] || "Unknown"}".`;
    },
    ROOM_CANCELLED_BY_TENANT: "Room has been cancelled successfully.",
    BOOKING_ALREADY_CANCELLED: "This booking has already been cancelled.",
    PROFILE_UPDATED: "Profile has been updated successfully"
};
