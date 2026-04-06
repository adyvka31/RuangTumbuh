const logger = require("../utils/logger");
const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingService.requestCourseBooking(req.body);
    logger.info(
      `[Booking] Siswa ${req.body.studentId} berhasil booking kursus ID: ${req.body.courseId}`,
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Booking berhasil diajukan!",
        data: newBooking,
      });
  } catch (error) {
    logger.error(`[Booking] Error createBooking: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message: error.message || "Terjadi kesalahan server",
      });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getStudentBookings(
      req.query.studentId,
    );
    logger.info(
      `[Booking] Fetch history booking oleh Siswa ID: ${req.query.studentId}`,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "History booking dimuat",
        data: bookings,
      });
  } catch (error) {
    logger.error(`[Booking] Error getMyBookings: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const getIncomingBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getTutorIncomingBookings(
      req.query.tutorId,
    );
    logger.info(
      `[Booking] Fetch daftar pesanan masuk untuk Tutor ID: ${req.query.tutorId}`,
    );
    res
      .status(200)
      .json({ success: true, message: "Pesanan masuk dimuat", data: bookings });
  } catch (error) {
    logger.error(`[Booking] Error getIncomingBookings: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const updated = await bookingService.changeBookingStatus(
      req.params.id,
      req.body.status,
      req.body.tutorId,
    );
    logger.info(
      `[Booking] Status booking ID ${req.params.id} diubah menjadi ${req.body.status} oleh Tutor ID: ${req.body.tutorId}`,
    );
    res.status(200).json({
      success: true,
      message: `Booking berhasil di${req.body.status === "ACCEPTED" ? "terima" : "tolak"}!`,
      data: updated,
    });
  } catch (error) {
    logger.error(`[Booking] Error updateBookingStatus: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message: error.message || "Terjadi kesalahan server",
      });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  updateBookingStatus,
};
