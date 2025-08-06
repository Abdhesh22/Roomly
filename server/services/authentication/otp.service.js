const DateTimeService = require("../date-time/date-time.service");

class Otp {
  generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  expiredTime = () => {
    const dateTime = new DateTimeService();
    return dateTime.getFormattedTimeAfterMinutes(10);
  };
}

module.exports = Otp;
