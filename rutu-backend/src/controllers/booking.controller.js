const logger = require("../utils/logger");
const bookingService = require("../services/booking.service");
const catchAsync = require("../utils/catchAsync");

const createBooking = catchAsync(async (req, res) => {
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
});

const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getStudentBookings(req.query.studentId);
  logger.info(
    `[Booking] Fetch history booking oleh Siswa ID: ${req.query.studentId}`,
  );

  res
    .status(200)
    .json({ success: true, message: "History booking dimuat", data: bookings });
});

const getIncomingBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getTutorIncomingBookings(
    req.query.tutorId,
  );
  logger.info(
    `[Booking] Fetch daftar pesanan masuk untuk Tutor ID: ${req.query.tutorId}`,
  );

  res
    .status(200)
    .json({ success: true, message: "Pesanan masuk dimuat", data: bookings });
});

const updateBookingStatus = catchAsync(async (req, res) => {
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
});

module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  updateBookingStatus,
};
