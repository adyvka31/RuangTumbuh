const prisma = require("../config/db");

const getUserProfile = async (id) => {
  // 1. Ambil data user dasar
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      timeBalance: true,
      location: true,
      birthday: true,
      school: true,
      description: true,
      passions: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error("User tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }

  // 2. Gunakan agregasi untuk menghitung menit (Jauh lebih cepat daripada looping manual)
  const [teachingCount, total1on1Minutes] = await Promise.all([
    prisma.course.count({ where: { tutorId: id } }),
    prisma.booking.aggregate({
      _sum: { durationMinutes: true },
      where: { studentId: id, status: "COMPLETED" },
    }),
  ]);

  // Kalkulasi sederhana di level DB untuk course (jika durasi disimpan sebagai string, tetap perlu diparse)
  // Namun untuk performa terbaik, simpanlah durasi sebagai Integer di DB.
  const myCourseBookings = await prisma.courseBooking.findMany({
    where: { studentId: id, status: "ACCEPTED" },
    include: { course: { select: { durasi: true } } },
  });

  const courseMinutes = myCourseBookings.reduce((acc, curr) => {
    return acc + (parseInt(curr.course?.durasi?.replace(/\D/g, "")) || 0);
  }, 0);

  return {
    ...user,
    passions: user.passions || [],
    stats: {
      learningMinutes:
        (total1on1Minutes._sum.durationMinutes || 0) + courseMinutes,
      teachingSessions: teachingCount,
    },
  };
};

const getDashboardStats = async (id) => {
  const now = new Date();

  // Jalankan query secara paralel namun lebih spesifik
  const [
    user,
    total1on1,
    upcoming1on1,
    upcomingCourses,
    finished1on1,
    finishedCourses,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { timeBalance: true } }),
    prisma.booking.aggregate({
      _sum: { durationMinutes: true },
      where: { studentId: id, status: "COMPLETED" },
    }),
    // Ambil data upcoming dengan LIMIT (jangan ambil semua agar tidak berat)
    prisma.booking.findMany({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
      include: { skill: true },
      orderBy: { scheduledAt: "asc" },
      take: 5, // Hanya ambil 5 jadwal terdekat
    }),
    prisma.courseBooking.findMany({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
      include: { course: true },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
    // Count saja untuk statistik (lebih ringan daripada findMany)
    prisma.booking.count({ where: { studentId: id, status: "COMPLETED" } }),
    prisma.courseBooking.count({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { lt: now } },
    }),
  ]);

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  // Gabungkan sesi mentoring untuk tampilan dashboard
  const mentoringSessions = [
    ...upcoming1on1.map((b) => ({
      id: b.id,
      title: b.skill ? `1-on-1: ${b.skill.name}` : "Mentoring",
      time: b.scheduledAt,
      status: "Akan Datang",
    })),
    ...upcomingCourses.map((b) => ({
      id: b.id,
      title: b.course ? `Kelas: ${b.course.name}` : "Sesi Kelas",
      time: b.scheduledAt,
      status: "Akan Datang",
    })),
  ].sort((a, b) => new Date(a.time) - new Date(b.time));

  return {
    timeBalance: user.timeBalance,
    learningMinutes: total1on1._sum.durationMinutes || 0,
    upcomingSessions: upcoming1on1.length + upcomingCourses.length,
    completedSessions: finished1on1 + finishedCourses,
    mentoringSessions,
  };
};

module.exports = {
  getUserProfile,
  getDashboardStats,
  updateUserProfile: require("./user.service").updateUserProfile,
};
