const prisma = require("../config/db");

const createBooking = async (req, res) => {
  try {
    const { courseId, studentId, studentName, scheduledAt, note } = req.body;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    if (!course)
      return res.status(404).json({ message: "Kursus tidak ditemukan!" });
    if (course.tutorId === studentId)
      return res
        .status(400)
        .json({
          message: "Kamu tidak bisa booking kursus yang kamu buat sendiri!",
        });

    const existingBooking = await prisma.courseBooking.findFirst({
      where: {
        courseId: parseInt(courseId),
        studentId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });
    if (existingBooking)
      return res
        .status(400)
        .json({
          message: "Kamu sudah mempunyai booking aktif untuk kursus ini!",
        });

    const newBooking = await prisma.courseBooking.create({
      data: {
        courseId: parseInt(courseId),
        studentId,
        studentName,
        scheduledAt: new Date(scheduledAt),
        note: note || null,
      },
    });
    res
      .status(201)
      .json({ message: "Booking berhasil diajukan!", booking: newBooking });
  } catch (error) {
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
    res.status(200).json(bookings);
  } catch (error) {
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
    if (courseIds.length === 0) return res.status(200).json([]);

    const bookings = await prisma.courseBooking.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        course: {
          select: { id: true, name: true, kategori: true, durasi: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(bookings);
  } catch (error) {
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

    if (!booking)
      return res.status(404).json({ message: "Booking tidak ditemukan!" });
    if (booking.course.tutorId !== tutorId)
      return res
        .status(403)
        .json({ message: "Kamu tidak berhak mengubah status booking ini!" });

    const updated = await prisma.courseBooking.update({
      where: { id },
      data: { status },
    });
    res
      .status(200)
      .json({
        message: `Booking berhasil di${status === "ACCEPTED" ? "terima" : "tolak"}!`,
        booking: updated,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// PASTIKAN BARIS INI ADA DI PALING BAWAH
module.exports = {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  updateBookingStatus,
};
