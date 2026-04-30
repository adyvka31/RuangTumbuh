const logger = require("../utils/logger");
const bookingService = require("../services/booking.service");
const catchAsync = require("../utils/catchAsync");
const notificationService = require("../services/notification.service");

const createBooking = catchAsync(async (req, res) => {
  const newBooking = await bookingService.requestCourseBooking(req.body);
  logger.info(
    `[Booking] Siswa ${req.body.studentId} berhasil booking kursus ID: ${req.body.courseId}`,
  );

  // Notifikasi untuk Tutor bahwa ada pesanan masuk
  const targetTutorId =
    req.body.tutorId || (newBooking.course && newBooking.course.tutorId);
  if (targetTutorId) {
    await notificationService.createNotification(
      targetTutorId,
      "Pesanan Kursus Baru",
      `Siswa ${req.body.studentName || "baru"} telah memesan sesi kursus Anda.`,
      "BOOKING_NEW",
    );
  }

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
  // Ambil userId dari body (siapa yang menekan tombol, bisa tutorId atau studentId)
  const requesterId = req.body.tutorId || req.body.userId;

  const updated = await bookingService.changeBookingStatus(
    req.params.id,
    req.body.status,
    requesterId,
  );

  // Sesuaikan pesan notifikasi
  if (updated && updated.studentId) {
    let title = "Pembaruan Status Pesanan";
    let message = `Pengajuan kursus Anda telah ${req.body.status === "ACCEPTED" ? "disetujui" : "ditolak"} oleh tutor.`;

    // Jika dibatalkan oleh siswa sendiri, mungkin tidak perlu kirim notif ke diri sendiri,
    // atau kirim notif konfirmasi pembatalan.
    if (req.body.status === "CANCELLED") {
      title = "Pembatalan Berhasil";
      message = "Anda telah membatalkan pengajuan kursus ini.";
    }

    await notificationService.createNotification(
      updated.studentId,
      title,
      message,
      "BOOKING_STATUS",
    );
  }

  res.status(200).json({
    success: true,
    message: `Booking berhasil di${req.body.status === "ACCEPTED" ? "terima" : req.body.status === "REJECTED" ? "tolak" : "batalkan"}!`,
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

  // Notifikasi untuk Siswa bahwa kursus telah selesai
  if (updated && updated.studentId) {
    await notificationService.createNotification(
      updated.studentId,
      "Kursus Selesai",
      "Sesi kursus Anda telah diselesaikan. Jangan lupa berikan ulasan!",
      "BOOKING_COMPLETED",
    );
  }

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
