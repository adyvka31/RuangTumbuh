const prisma = require("../config/db");
const logger = require("../utils/logger");

const createBooking = async (req, res) => {
  try {
    const { courseId, studentId, studentName, scheduledAt, note } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course) {
      logger.warn(`[Booking] Gagal booking, kursus tidak ada. ID: ${courseId}`);
      return res.status(404).json({ message: "Kursus tidak ditemukan!" });
    }
    if (course.tutorId === studentId) {
      logger.warn(
        `[Booking] Tutor mencoba booking kursus sendiri. User ID: ${studentId}`,
      );
      return res
        .status(400)
        .json({
          message: "Kamu tidak bisa booking kursus yang kamu buat sendiri!",
        });
    }

    const existingBooking = await prisma.courseBooking.findFirst({
      where: {
        courseId: parseInt(courseId),
        studentId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });
    if (existingBooking) {
      logger.warn(
        `[Booking] Double booking terdeteksi oleh User ID: ${studentId} untuk Kursus ID: ${courseId}`,
      );
      return res
        .status(400)
        .json({
          message: "Kamu sudah mempunyai booking aktif untuk kursus ini!",
        });
    }

    const newBooking = await prisma.courseBooking.create({
      data: {
        courseId: parseInt(courseId),
        studentId,
        studentName,
        scheduledAt: new Date(scheduledAt),
        note: note || null,
      },
    });

    logger.info(
      `[Booking] Siswa ${studentId} berhasil booking kursus ID: ${courseId}`,
    );
    res
      .status(201)
      .json({ message: "Booking berhasil diajukan!", booking: newBooking });
  } catch (error) {
    logger.error(`[Booking] Error createBooking: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { studentId } = req.query;
    const bookings = await prisma.courseBooking.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            tutor: true,
            tutorId: true,
            kategori: true,
            durasi: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    logger.info(`[Booking] Fetch history booking oleh Siswa ID: ${studentId}`);
    res.status(200).json(bookings);
  } catch (error) {
    logger.error(`[Booking] Error getMyBookings: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getIncomingBookings = async (req, res) => {
  try {
    const { tutorId } = req.query;
    const tutorCourses = await prisma.course.findMany({
      where: { tutorId },
      select: { id: true },
    });
    const courseIds = tutorCourses.map((c) => c.id);

    if (courseIds.length === 0) {
      logger.info(
        `[Booking] Tutor ID ${tutorId} mengecek pesanan masuk (belum punya kursus)`,
      );
      return res.status(200).json([]);
    }

    const bookings = await prisma.courseBooking.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: {
          select: { id: true, name: true, kategori: true, durasi: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    logger.info(
      `[Booking] Fetch daftar pesanan masuk untuk Tutor ID: ${tutorId}`,
    );
    res.status(200).json(bookings);
  } catch (error) {
    logger.error(`[Booking] Error getIncomingBookings: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tutorId } = req.body;

    const booking = await prisma.courseBooking.findUnique({
      where: { id },
      include: { course: { select: { tutorId: true } } },
    });

    if (!booking) {
      logger.warn(
        `[Booking] Gagal update status, booking ID tidak ditemukan: ${id}`,
      );
      return res.status(404).json({ message: "Booking tidak ditemukan!" });
    }
    if (booking.course.tutorId !== tutorId) {
      logger.warn(
        `[Booking] User ID ${tutorId} mencoba meretas status booking milik tutor lain!`,
      );
      return res
        .status(403)
        .json({ message: "Kamu tidak berhak mengubah status booking ini!" });
    }

    const updated = await prisma.courseBooking.update({
      where: { id },
      data: { status },
    });

    logger.info(
      `[Booking] Status booking ID ${id} diubah menjadi ${status} oleh Tutor ID: ${tutorId}`,
    );
    res
      .status(200)
      .json({
        message: `Booking berhasil di${status === "ACCEPTED" ? "terima" : "tolak"}!`,
        booking: updated,
      });
  } catch (error) {
    logger.error(`[Booking] Error updateBookingStatus: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  updateBookingStatus,
};
