const { addMinutes: addMinutesToDate, format } = require("date-fns");

class DateTime {
  getCurrentTime() {
    return new Date();
  }

  getCurrentFormattedTime() {
    return format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }

  getFormattedTimeAfterMinutes(minutes, date = new Date()) {
    const expiry = addMinutesToDate(date, minutes);
    return format(expiry, "yyyy-MM-dd HH:mm:ss");
  }
}

module.exports = DateTime;
