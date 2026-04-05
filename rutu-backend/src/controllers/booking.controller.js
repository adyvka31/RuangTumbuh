const logger = require("../utils/logger");
const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingService.requestCourseBooking(req.body);
    res
      .status(201)
      .json({ message: "Booking berhasil diajukan!", booking: newBooking });
  } catch (error) {
    logger.error(`[Booking] Error createBooking: ${error.message}`);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getStudentBookings(
      req.query.studentId,
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const getIncomingBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getTutorIncomingBookings(
      req.query.tutorId,
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const updated = await bookingService.changeBookingStatus(
      req.params.id,
      req.body.status,
      req.body.tutorId,
    );
    res
      .status(200)
      .json({
        message: `Booking berhasil di${req.body.status === "ACCEPTED" ? "terima" : "tolak"}!`,
        booking: updated,
      });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  updateBookingStatus,
};
