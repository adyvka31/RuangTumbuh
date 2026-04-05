const prisma = require("../config/db");
const logger = require("../utils/logger");

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
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
      logger.warn(`[User] Profil tidak ditemukan untuk ID: ${id}`);
      return res.status(404).json({ message: "User tidak ditemukan!" });
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

    let total1on1Minutes = 0;
    my1on1Bookings.forEach(
      (session) => (total1on1Minutes += session.durationMinutes || 0),
    );
    let totalCourseMinutes = 0;
    myCourseBookings.forEach((booking) => {
      if (booking.course && booking.course.durasi)
        totalCourseMinutes +=
          parseInt(booking.course.durasi.replace(/\D/g, "")) || 0;
    });

    const learningMinutes = total1on1Minutes + totalCourseMinutes;

    logger.info(`[User] Data profil berhasil dimuat untuk ID: ${id}`);
    res
      .status(200)
      .json({ ...user, stats: { learningMinutes, teachingSessions } });
  } catch (error) {
    logger.error(`[User] Error getProfile: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, location, birthday, school, description, passions } = req.body;

    if (name) {
      const nameRegex = /^[a-zA-Z\s]*$/;
      const nameWords = name.trim().split(/\s+/);
      if (
        !nameRegex.test(name) ||
        nameWords.length < 2 ||
        nameWords.length > 5
      ) {
        return res
          .status(400)
          .json({
            message:
              "Nama lengkap harus berisi huruf saja, terdiri dari 2 hingga 5 kata.",
          });
      }
    }
    if (birthday) {
      const selectedDate = new Date(birthday);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today)
        return res
          .status(400)
          .json({
            message: "Tanggal lahir tidak valid (tidak boleh di masa depan).",
          });
    }
    if (description && description.length > 500)
      return res
        .status(400)
        .json({
          message: "Deskripsi diri terlalu panjang (Maksimal 500 karakter).",
        });
    if (location && location.length > 100)
      return res
        .status(400)
        .json({ message: "Lokasi terlalu panjang (Maksimal 100 karakter)." });
    if (school && school.length > 100)
      return res
        .status(400)
        .json({ message: "Nama institusi/sekolah terlalu panjang." });

    let parsedPassions = [];
    if (typeof passions === "string") {
      try {
        parsedPassions = JSON.parse(passions);
      } catch (e) {}
    } else if (Array.isArray(passions)) {
      parsedPassions = passions;
    }
    if (parsedPassions.length > 10)
      return res
        .status(400)
        .json({
          message: "Maksimal hanya boleh menambahkan 10 keahlian/passion.",
        });

    const updateData = {
      name,
      location,
      birthday,
      school,
      description,
      passions: parsedPassions,
    };
    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    logger.info(`[User] Profil berhasil diperbarui untuk ID: ${id}`);
    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui!", user: updatedUser });
  } catch (error) {
    logger.error(`[User] Error updateProfile: ${error.message}`, {
      stack: error.stack,
    });
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
    if (!user) {
      logger.warn(`[Dashboard] User tidak ditemukan untuk ID: ${id}`);
      return res.status(404).json({ message: "User tidak ditemukan" });
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
    ];

    logger.info(`[Dashboard] Stats berhasil dimuat untuk ID: ${id}`);
    res.json({
      timeBalance: user.timeBalance,
      learningMinutes,
      upcomingSessions: upcoming1on1 + upcomingCourses,
      completedSessions: finished1on1 + finishedCourses,
      mentoringSessions: rawSessions.sort(
        (a, b) => new Date(a.time) - new Date(b.time),
      ),
    });
  } catch (error) {
    logger.error(`[Dashboard] Error getDashboardStats: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Error fetch dashboard stats", error: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
