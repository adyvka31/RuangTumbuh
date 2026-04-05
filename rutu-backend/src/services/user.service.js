const prisma = require("../config/db");

const getUserProfile = async (id) => {
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
  user.passions = user.passions || [];

  const [teachingSessions, my1on1Bookings, myCourseBookings] =
    await Promise.all([
      prisma.course.count({ where: { tutorId: id } }),
      prisma.booking.findMany({
        where: { studentId: id, status: "COMPLETED" },
      }),
      prisma.courseBooking.findMany({
        where: { studentId: id, status: "ACCEPTED" },
        include: { course: true },
      }),
    ]);

  let learningMinutes = 0;
  my1on1Bookings.forEach(
    (session) => (learningMinutes += session.durationMinutes || 0),
  );
  myCourseBookings.forEach((booking) => {
    if (booking.course && booking.course.durasi)
      learningMinutes +=
        parseInt(booking.course.durasi.replace(/\D/g, "")) || 0;
  });

  return { ...user, stats: { learningMinutes, teachingSessions } };
};

const updateUserProfile = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};

const getDashboardStats = async (id) => {
  const now = new Date();
  const user = await prisma.user.findUnique({
    where: { id },
    select: { timeBalance: true },
  });
  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  const [
    completed1on1,
    acceptedCourses,
    upcoming1on1,
    upcomingCourses,
    finished1on1,
    finishedCourses,
    upcoming1on1List,
    upcomingCourseList,
  ] = await Promise.all([
    prisma.booking.findMany({ where: { studentId: id, status: "COMPLETED" } }),
    prisma.courseBooking.findMany({
      where: { studentId: id, status: "ACCEPTED" },
      include: { course: true },
    }),
    prisma.booking.count({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
    }),
    prisma.courseBooking.count({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
    }),
    prisma.booking.count({ where: { studentId: id, status: "COMPLETED" } }),
    prisma.courseBooking.count({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { lt: now } },
    }),
    prisma.booking.findMany({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
      include: { skill: true },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.courseBooking.findMany({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
      include: { course: true },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  let learningMinutes = 0;
  completed1on1.forEach((b) => (learningMinutes += b.durationMinutes || 0));
  acceptedCourses.forEach((b) => {
    if (b.course && b.course.durasi)
      learningMinutes += parseInt(b.course.durasi.replace(/\D/g, "")) || 0;
  });

  const rawSessions = [
    ...upcoming1on1List.map((b) => ({
      id: b.id,
      title: b.skill ? `1-on-1: ${b.skill.name}` : "Sesi Mentoring",
      time: b.scheduledAt,
      status: "Akan Datang",
    })),
    ...upcomingCourseList.map((b) => ({
      id: b.id,
      title: b.course ? `Kelas: ${b.course.name}` : "Sesi Kelas",
      time: b.scheduledAt,
      status: "Akan Datang",
    })),
  ].sort((a, b) => new Date(a.time) - new Date(b.time));

  return {
    timeBalance: user.timeBalance,
    learningMinutes,
    upcomingSessions: upcoming1on1 + upcomingCourses,
    completedSessions: finished1on1 + finishedCourses,
    mentoringSessions: rawSessions,
  };
};

module.exports = { getUserProfile, updateUserProfile, getDashboardStats };
