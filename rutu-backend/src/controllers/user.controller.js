const prisma = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Cek User dulu (Jika user tidak ada, langsung batalkan)
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
    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan!" });
    user.passions = user.passions || [];

    // 2. PARALEL EKSEKUSI (Jalan Bersamaan)
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

    let total1on1Minutes = 0;
    my1on1Bookings.forEach(
      (session) => (total1on1Minutes += session.durationMinutes || 0),
    );

    let totalCourseMinutes = 0;
    myCourseBookings.forEach((booking) => {
      if (booking.course && booking.course.durasi) {
        totalCourseMinutes +=
          parseInt(booking.course.durasi.replace(/\D/g, "")) || 0;
      }
    });

    const learningMinutes = total1on1Minutes + totalCourseMinutes;
    res
      .status(200)
      .json({ ...user, stats: { learningMinutes, teachingSessions } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, location, birthday, school, description, passions } = req.body;
    if (typeof passions === "string") {
      try {
        passions = JSON.parse(passions);
      } catch (e) {
        passions = [];
      }
    }
    const updateData = {
      name,
      location,
      birthday,
      school,
      description,
      passions: passions || [],
    };
    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui!", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();

    const user = await prisma.user.findUnique({
      where: { id },
      select: { timeBalance: true },
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // PARALEL EKSEKUSI SUPER CEPAT (8 Query berjalan sekaligus!)
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
      prisma.booking.findMany({
        where: { studentId: id, status: "COMPLETED" },
      }),
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
        title: b.skill ? `1-on-1: ${b.skill.name}` : "Sesi Mentoring 1-on-1",
        time: b.scheduledAt,
        url: b.meetingLink || "#",
        status: "Akan Datang",
      })),
      ...upcomingCourseList.map((b) => ({
        id: b.id,
        title: b.course ? `Kelas: ${b.course.name}` : "Sesi Kelas",
        time: b.scheduledAt,
        url: "#",
        status: "Akan Datang",
      })),
    ];
    const mentoringSessions = rawSessions.sort(
      (a, b) => new Date(a.time) - new Date(b.time),
    );

    res.json({
      timeBalance: user.timeBalance,
      learningMinutes,
      upcomingSessions: upcoming1on1 + upcomingCourses,
      completedSessions: finished1on1 + finishedCourses,
      mentoringSessions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetch dashboard stats", error: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
