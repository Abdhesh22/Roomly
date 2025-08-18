const { addMinutes: addMinutesToDate, format } = require("date-fns");

class DateTimeService {
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

  convertHourToSeconds(hour) {
    return 3600 * hour;
  }

  getFormmatedTime(dateTime) {
    return format(new Date(dateTime), "yyyy-MM-dd HH:mm:ss");
  }

}

module.exports = DateTimeService;
