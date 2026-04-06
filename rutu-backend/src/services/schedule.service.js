const prisma = require("../config/db");
const { BOOKING_STATUS } = require("../utils/constants"); 

const addSelfSchedule = async (data) => {
  const safeTime = data.time.replace(".", ":");
  const scheduledAt = new Date(`${data.date}T${safeTime}:00`);
  if (isNaN(scheduledAt.getTime())) {
    const error = new Error("Format tanggal atau waktu tidak valid.");
    error.statusCode = 400;
    throw error;
  }
  const customData = JSON.stringify({
    title: data.title,
    category: data.category,
    platform: data.platform,
    partner: data.partner,
  });

  return await prisma.booking.create({
    data: {
      studentId: data.studentId,
      tutorId: data.studentId,
      status: BOOKING_STATUS.ACCEPTED, 
      scheduledAt,
      durationMinutes: parseInt(data.durationMinutes) || 60,
      meetingLink: data.platform,
      notes: customData,
    },
  });
};

const fetchAllSchedules = async (studentId) => {
  const [my1on1Bookings, myCourseBookings] = await Promise.all([
    prisma.booking.findMany({ where: { studentId }, include: { skill: true } }),
    prisma.courseBooking.findMany({
      where: { studentId },
      include: { course: true },
    }),
  ]);

  return [
    ...my1on1Bookings.map((b) => {
      const startDate = new Date(b.scheduledAt);
      const endDate = new Date(
        startDate.getTime() + (b.durationMinutes || 60) * 60000,
      );
      let meta = {};
      try {
        if (b.notes) meta = JSON.parse(b.notes);
      } catch (e) {}

      return {
        id: `booking-${b.id}`,
        date: startDate.toISOString(),
        time: startDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        title:
          meta.title ||
          (b.skill ? `Mentoring: ${b.skill.name}` : "Sesi 1-on-1"),
        partner: meta.partner || "Tutor Ahli",
        role: "Sesi",
        platform:
          meta.platform || (b.meetingLink ? "Google Meet" : "Belum Tersedia"),
        // 3. GANTI MAGIC STRINGS
        status:
          b.status === BOOKING_STATUS.COMPLETED
            ? "Selesai"
            : b.status === BOOKING_STATUS.ACCEPTED
              ? "Akan Datang"
              : "Menunggu Konfirmasi",
        color:
          b.status === BOOKING_STATUS.COMPLETED
            ? "#e5e7eb"
            : "var(--primary-yellow)",
        category: meta.category || "Mentoring",
      };
    }),
    ...myCourseBookings.map((b) => {
      const startDate = new Date(b.scheduledAt);
      const duration =
        parseInt(
          b.course && b.course.durasi
            ? b.course.durasi.replace(/\D/g, "")
            : "60",
        ) || 60;
      const endDate = new Date(startDate.getTime() + duration * 60000);

      return {
        id: `course-${b.id}`,
        date: startDate.toISOString(),
        time: startDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        title: b.course ? `Kelas: ${b.course.name}` : "Sesi Kelas",
        partner: b.course ? b.course.tutor : "Tutor Ahli",
        role: "Mentor",
        platform: "Zoom Meeting",
        // 4. GANTI MAGIC STRINGS
        status:
          b.status === BOOKING_STATUS.COMPLETED
            ? "Selesai"
            : b.status === BOOKING_STATUS.ACCEPTED
              ? "Akan Datang"
              : "Menunggu Konfirmasi",
        color:
          b.status === BOOKING_STATUS.COMPLETED
            ? "#e5e7eb"
            : "var(--primary-green)",
        category: "Kelas",
      };
    }),
  ];
};

const modifySchedule = async (type, actualId, data) => {
  const safeTime = data.time.replace(".", ":");
  const scheduledAt = new Date(`${data.date}T${safeTime}:00`);
  if (isNaN(scheduledAt.getTime())) {
    const error = new Error("Format waktu tidak valid.");
    error.statusCode = 400;
    throw error;
  }
  const customData = JSON.stringify({
    title: data.title,
    category: data.category,
    platform: data.platform,
    partner: data.partner,
  });

  if (type === "booking") {
    return await prisma.booking.update({
      where: { id: actualId },
      data: {
        scheduledAt,
        durationMinutes: parseInt(data.durationMinutes) || 60,
        meetingLink: data.platform,
        notes: customData,
      },
    });
  } else if (type === "course") {
    return await prisma.courseBooking.update({
      where: { id: actualId },
      data: { scheduledAt, note: customData },
    });
  }
};

const removeScheduleData = async (type, actualId) => {
  if (type === "booking")
    return await prisma.booking.delete({ where: { id: actualId } });
  else if (type === "course")
    return await prisma.courseBooking.delete({ where: { id: actualId } });
};

module.exports = {
  addSelfSchedule,
  fetchAllSchedules,
  modifySchedule,
  removeScheduleData,
};
