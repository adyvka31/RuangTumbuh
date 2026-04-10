const logger = require("../utils/logger");
const bookingService = require("../services/booking.service");
const catchAsync = require("../utils/catchAsync");

const createBooking = catchAsync(async (req, res) => {
  const newBooking = await bookingService.requestCourseBooking(req.body);
  logger.info(
    `[Booking] Siswa ${req.body.studentId} berhasil booking kursus ID: ${req.body.courseId}`,
  );

  res.status(201).json({
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

const completeBooking = catchAsync(async (req, res) => {
  const { tutorId, token } = req.body;

  const updated = await bookingService.completeCourseByToken(
    req.params.id,
    tutorId,
    token,
  );

  logger.info(
    `[Booking] Sesi ID ${req.params.id} berhasil diselesaikan dengan token oleh Tutor ID: ${tutorId}`,
  );

  res.status(200).json({
    success: true,
    message: "Kelas berhasil diselesaikan!",
    data: updated,
  });
});

const submitFeedback = catchAsync(async (req, res) => {
  const { rating, review } = req.body;
  const bookingId = req.params.id;

  // Panggil lewat bookingService, bukan langsung prisma
  const updatedBooking = await bookingService.addFeedback(
    bookingId,
    rating,
    review,
  );

  logger.info(`[Booking] Feedback ditambahkan untuk sesi ID: ${bookingId}`);

  res.status(200).json({
    success: true,
    message: "Feedback berhasil disimpan!",
    data: updatedBooking,
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  updateBookingStatus,
  completeBooking,
  submitFeedback,
};
