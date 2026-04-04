const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

// POST /api/bookings
router.post("/", bookingController.createBooking);

// GET /api/bookings/student (Aslinya /my-bookings)
router.get("/student", bookingController.getMyBookings);

// GET /api/bookings/tutor (Aslinya /incoming)
router.get("/tutor", bookingController.getIncomingBookings);

// PATCH /api/bookings/:id/status
router.patch("/:id/status", bookingController.updateBookingStatus);

module.exports = router;
