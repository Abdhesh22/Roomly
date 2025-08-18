const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../middleware/authentication.middleware.js");
const BookingController = require("../controller/booking/booking.controller.js");

router.get("/", AuthenticationMiddleware.verify, BookingController.getHostBooking);
router.post("/confirm", AuthenticationMiddleware.verify, BookingController.confirm);
router.post("/cancel-by-host", AuthenticationMiddleware.verify, BookingController.cancelByHost);
router.post("/cancel-by-user", AuthenticationMiddleware.verify, BookingController.cancelByUser);
router.get("/user-booking", AuthenticationMiddleware.verify, BookingController.bookingForUser);
router.post("/checkout", AuthenticationMiddleware.verify, BookingController.checkout);

module.exports = router;