// src/services/booking.service.js
const prisma = require("../config/db");
const { BOOKING_STATUS } = require("../utils/constants"); // 1. IMPORT CONSTANTS

const requestCourseBooking = async (data) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(data.courseId) },
  });
  if (!course) {
    const error = new Error("Kursus tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }
  if (course.tutorId === data.studentId) {
    const error = new Error(
      "Kamu tidak bisa booking kursus yang kamu buat sendiri!",
    );
    error.statusCode = 400;
    throw error;
  }

  const existingBooking = await prisma.courseBooking.findFirst({
    where: {
      courseId: parseInt(data.courseId),
      studentId: data.studentId,
      // 2. GANTI MAGIC STRINGS DI SINI
      status: { in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED] },
    },
  });
  if (existingBooking) {
    const error = new Error(
      "Kamu sudah mempunyai booking aktif untuk kursus ini!",
    );
    error.statusCode = 400;
    throw error;
  }

  return await prisma.courseBooking.create({
    data: {
      courseId: parseInt(data.courseId),
      studentId: data.studentId,
      studentName: data.studentName,
      scheduledAt: new Date(data.scheduledAt),
      note: data.note || null,
    },
  });
};

const getStudentBookings = async (studentId) => {
  return await prisma.courseBooking.findMany({
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
};

const getTutorIncomingBookings = async (tutorId) => {
  const tutorCourses = await prisma.course.findMany({
    where: { tutorId },
    select: { id: true },
  });
  const courseIds = tutorCourses.map((c) => c.id);
  if (courseIds.length === 0) return [];

  return await prisma.courseBooking.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: {
        select: { id: true, name: true, kategori: true, durasi: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const changeBookingStatus = async (id, status, tutorId) => {
  const booking = await prisma.courseBooking.findUnique({
    where: { id },
    include: { course: { select: { tutorId: true } } },
  });
  if (!booking) {
    const error = new Error("Booking tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }
  if (booking.course.tutorId !== tutorId) {
    const error = new Error("Kamu tidak berhak mengubah status booking ini!");
    error.statusCode = 403;
    throw error;
  }

  // Siapkan data yang akan diupdate
  let updateData = { status };

  // LOGIKA TOKEN: Jika mentor menerima (ACCEPTED), generate token rahasia
  if (status === "ACCEPTED") {
    // Generate 6 karakter acak (huruf besar dan angka)
    const generatedToken = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    updateData.token = generatedToken;
  }

  return await prisma.courseBooking.update({
    where: { id },
    data: updateData,
  });
};

const completeCourseByToken = async (id, tutorId, inputToken) => {
  const booking = await prisma.courseBooking.findUnique({
    where: { id },
    include: { course: { select: { tutorId: true } } },
  });

  if (!booking) {
    const error = new Error("Booking tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }
  if (booking.course.tutorId !== tutorId) {
    const error = new Error("Kamu tidak berhak menyelesaikan kelas ini!");
    error.statusCode = 403;
    throw error;
  }
  if (booking.status !== "ACCEPTED") {
    const error = new Error("Kelas belum disetujui atau sudah selesai!");
    error.statusCode = 400;
    throw error;
  }

  // LOGIKA VALIDASI TOKEN
  if (!booking.token || booking.token !== inputToken) {
    const error = new Error("Token penyelesaian tidak valid!");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.courseBooking.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
};

const addFeedback = async (bookingId, rating, review) => {
  return await prisma.courseBooking.update({
    where: { id: bookingId },
    data: {
      rating: parseInt(rating),
      review: review,
    },
  });
};

module.exports = {
  requestCourseBooking,
  getStudentBookings,
  getTutorIncomingBookings,
  changeBookingStatus,
  completeCourseByToken,
  addFeedback,
};
