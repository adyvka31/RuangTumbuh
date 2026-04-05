const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

// Import middleware dan schema
const validate = require("../middlewares/validate.middleware");
const {
  createBookingSchema,
  updateBookingStatusSchema,
} = require("../validations/booking.validation");

router.post(
  "/",
  validate(createBookingSchema),
  bookingController.createBooking,
);
router.get("/student", bookingController.getMyBookings);
router.get("/tutor", bookingController.getIncomingBookings);
router.patch(
  "/:id/status",
  validate(updateBookingStatusSchema),
  bookingController.updateBookingStatus,
);

module.exports = router;
