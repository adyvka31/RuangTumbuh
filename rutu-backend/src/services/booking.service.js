const prisma = require("../config/db");
const { BOOKING_STATUS } = require("../utils/constants");

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

  // --- LOGIKA TIME BANKING: VALIDASI SALDO SISWA ---
  const durationMinutes = parseInt(course.durasi) || 0;
  const student = await prisma.user.findUnique({
    where: { id: data.studentId },
  });

  if (!student || student.timeBalance < durationMinutes) {
    const error = new Error(
      `Saldo waktu tidak cukup! Sesi ini butuh ${durationMinutes} menit, sedangkan saldo kamu ${student?.timeBalance || 0} menit.`,
    );
    error.statusCode = 400;
    throw error;
  }

  const existingBooking = await prisma.courseBooking.findFirst({
    where: {
      courseId: parseInt(data.courseId),
      studentId: data.studentId,
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

  // --- LOGIKA TIME BANKING: TRANSACTION (BUAT BOOKING + POTONG SALDO) ---
  // Menggunakan $transaction agar jika salah satu gagal, keduanya dibatalkan
  const [newBooking] = await prisma.$transaction([
    prisma.courseBooking.create({
      data: {
        courseId: parseInt(data.courseId),
        studentId: data.studentId,
        studentName: data.studentName,
        scheduledAt: new Date(data.scheduledAt),
        note: data.note || null,
      },
    }),
    prisma.user.update({
      where: { id: data.studentId },
      data: { timeBalance: { decrement: durationMinutes } }, // Potong Saldo
    }),
  ]);

  return newBooking;
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

const changeBookingStatus = async (id, status, requesterId) => {
  // Ubah tutorId menjadi requesterId agar lebih umum
  const booking = await prisma.courseBooking.findUnique({
    where: { id },
    include: { course: { select: { tutorId: true, durasi: true } } },
  });

  if (!booking) {
    const error = new Error("Booking tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }

  // --- LOGIKA OTORISASI BARU ---
  const isTutor = booking.course.tutorId === requesterId;
  const isStudent = booking.studentId === requesterId;

  // Siswa HANYA boleh membatalkan jika statusnya CANCELLED
  if (isStudent && status !== "CANCELLED") {
    const error = new Error("Siswa hanya diperbolehkan membatalkan pengajuan!");
    error.statusCode = 403;
    throw error;
  }

  // Jika bukan tutor dan bukan siswa yang membatalkan, tolak.
  if (!isTutor && !(isStudent && status === "CANCELLED")) {
    const error = new Error("Kamu tidak berhak mengubah status booking ini!");
    error.statusCode = 403;
    throw error;
  }

  let updateData = { status };
  const durationMinutes = parseInt(booking.course.durasi) || 0;

  // --- LOGIKA TIME BANKING: ACCEPTED (Hanya untuk Tutor) ---
  if (status === "ACCEPTED" && isTutor) {
    const generatedToken = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    updateData.token = generatedToken;

    const [updatedBooking] = await prisma.$transaction([
      prisma.courseBooking.update({ where: { id }, data: updateData }),
      prisma.user.update({
        where: { id: requesterId },
        data: { timeBalance: { increment: durationMinutes } },
      }),
    ]);
    return updatedBooking;
  }

  // --- LOGIKA TIME BANKING: REJECTED/CANCELLED (Refund ke Siswa) ---
  else if (status === "CANCELLED") {
    const [deletedBooking] = await prisma.$transaction([
      prisma.courseBooking.delete({ where: { id } }),
      prisma.user.update({
        where: { id: booking.studentId },
        data: { timeBalance: { increment: durationMinutes } }, // Refund saldo siswa
      }),
    ]);
    return deletedBooking;
  } else if (status === "REJECTED") {
    const [updatedBooking] = await prisma.$transaction([
      // Gunakan update() karena data penolakan dari mentor biasanya masih disimpan sebagai riwayat
      prisma.courseBooking.update({ where: { id }, data: updateData }),
      prisma.user.update({
        where: { id: booking.studentId },
        data: { timeBalance: { increment: durationMinutes } }, // Refund saldo siswa
      }),
    ]);
    return updatedBooking;
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
