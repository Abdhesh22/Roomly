const { addMinutes: addMinutesToDate, format, setHours, parseISO, setMinutes, setMilliseconds, setSeconds } = require("date-fns");

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

  async convertToDate(date) {
    return await parseISO(date);
  }

  async setFixedTime(dateStr, hour, minute = 0) {
    let date = await parseISO(dateStr);
    date = await setHours(date, hour);
    date = await setMinutes(date, minute);
    date = await setSeconds(date, 0);
    date = await setMilliseconds(date, 0);
    return await format(date, "yyyy-MM-dd HH:mm:ss");
  }

  async subtractDays(date, noOfDays) {
    date = await parseISO(date);
    return await subDays(date, noOfDays);
  }

}

module.exports = DateTimeService;
