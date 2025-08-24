const { BillingStatus } = require("../utilities/constants/booking-status.constant.js");
const BookingDAO = require("../dao/billing.dao.js");
const BillingService = require("../services/billing.service");
const DateTimeService = require("./date-time/date-time.service.js");

class CronJobService {
    checkIn = async () => {
        try {

            const bookingDao = await BookingDAO.init();
            const dateTimeService = new DateTimeService();

            const billingService = new BillingService();
            const now = dateTimeService.getCurrentTime();

            const bookings = await bookingDao.find({
                status: BillingStatus.CONFIRMED,
                "bookingDetails.checkin": { $lte: now }
            });

            for (const booking of bookings) {
                await billingService.updateStatus({
                    billingId: booking._id,
                    status: BillingStatus.CHECKED_IN,
                    roomId: booking.roomId
                });
            }

            console.log(`[CRON] Auto Check-In processed: ${bookings.length}`);
        } catch (err) {
            throw err;
        }

    }

    checkOut = async () => {
        try {

            const dateTimeService = new DateTimeService();
            const billingService = new BillingService();
            const bookingDao = await BookingDAO.init();
            const now = dateTimeService.getCurrentTime();

            const bookings = await bookingDao.find({
                status: BillingStatus.CHECKED_IN,
                "bookingDetails.checkout": { $lte: now }
            });

            for (const booking of bookings) {
                await billingService.updateStatus({
                    billingId: booking._id,
                    status: BillingStatus.CHECKED_OUT,
                    roomId: booking.roomId
                });
            }
            console.log(`[CRON] Auto Check-Out processed: ${bookings.length}`);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = CronJobService;