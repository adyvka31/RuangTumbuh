const prisma = require("../config/db");
const logger = require("../utils/logger");

const validateScheduleInput = (title, platform, partner, date, time) => {
  if (!title || title.length < 3 || title.length > 50)
    return "Nama kegiatan harus 3-50 karakter.";
  if (!platform || platform.length < 3 || platform.length > 50)
    return "Platform / Lokasi harus 3-50 karakter.";
  if (!partner || partner.length < 3 || partner.length > 50)
    return "Nama partisipan harus 3-50 karakter.";
  if (!date || !time) return "Tanggal dan Waktu tidak boleh kosong.";
  return null;
};

const addSchedule = async (req, res) => {
  try {
    const {
      studentId,
      title,
      date,
      time,
      durationMinutes,
      category,
      platform,
      partner,
    } = req.body;

    const validationError = validateScheduleInput(
      title,
      platform,
      partner,
      date,
      time,
    );
    if (validationError)
      return res.status(400).json({ message: validationError });

    const safeTime = time.replace(".", ":");
    const scheduledAt = new Date(`${date}T${safeTime}:00`);

    if (isNaN(scheduledAt.getTime()))
      return res
        .status(400)
        .json({ message: "Format tanggal atau waktu tidak valid." });

    const customData = JSON.stringify({ title, category, platform, partner });

    const newSchedule = await prisma.booking.create({
      data: {
        studentId,
        tutorId: studentId,
        status: "ACCEPTED",
        scheduledAt,
        durationMinutes: parseInt(durationMinutes) || 60,
        meetingLink: platform,
        notes: customData,
      },
    });

    logger.info(
      `[Schedule] Jadwal mandiri berhasil dibuat oleh User ID: ${studentId}`,
    );
    res
      .status(201)
      .json({ message: "Jadwal berhasil ditambahkan!", schedule: newSchedule });
  } catch (error) {
    logger.error(`[Schedule] Error addSchedule: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    const [my1on1Bookings, myCourseBookings] = await Promise.all([
      prisma.booking.findMany({
        where: { studentId: id },
        include: { skill: true },
      }),
      prisma.courseBooking.findMany({
        where: { studentId: id },
        include: { course: true },
      }),
    ]);

    const allSchedules = [
      ...my1on1Bookings.map((b) => {
        const startDate = new Date(b.scheduledAt);
        const duration = b.durationMinutes || 60;
        const endDate = new Date(startDate.getTime() + duration * 60000);
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
          status:
            b.status === "COMPLETED"
              ? "Selesai"
              : b.status === "ACCEPTED"
                ? "Akan Datang"
                : "Menunggu Konfirmasi",
          color: b.status === "COMPLETED" ? "#e5e7eb" : "var(--primary-yellow)",
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
          status:
            b.status === "COMPLETED"
              ? "Selesai"
              : b.status === "ACCEPTED"
                ? "Akan Datang"
                : "Menunggu Konfirmasi",
          color: b.status === "COMPLETED" ? "#e5e7eb" : "var(--primary-green)",
          category: "Kelas",
        };
      }),
    ];

    logger.info(`[Schedule] Data kalender diambil untuk User ID: ${id}`);
    res.status(200).json(allSchedules);
  } catch (error) {
    logger.error(`[Schedule] Error getAllSchedules: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Gagal mengambil data jadwal" });
  }
};

const editSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const type = id.split("-")[0];
    const actualId = id.substring(type.length + 1);
    const { title, date, time, durationMinutes, category, platform, partner } =
      req.body;

    const validationError = validateScheduleInput(
      title,
      platform,
      partner,
      date,
      time,
    );
    if (validationError)
      return res.status(400).json({ message: validationError });

    const safeTime = time.replace(".", ":");
    const scheduledAt = new Date(`${date}T${safeTime}:00`);
    if (isNaN(scheduledAt.getTime()))
      return res.status(400).json({ message: "Format waktu tidak valid." });

    const customData = JSON.stringify({ title, category, platform, partner });

    if (type === "booking") {
      await prisma.booking.update({
        where: { id: actualId },
        data: {
          scheduledAt,
          durationMinutes: parseInt(durationMinutes) || 60,
          meetingLink: platform,
          notes: customData,
        },
      });
    } else if (type === "course") {
      await prisma.courseBooking.update({
        where: { id: actualId },
        data: { scheduledAt, note: customData },
      });
    }

    logger.info(
      `[Schedule] Jadwal (${type}) berhasil di-reschedule. ID Jadwal: ${actualId}`,
    );
    res.status(200).json({ message: "Jadwal berhasil di-reschedule!" });
  } catch (error) {
    logger.error(`[Schedule] Error editSchedule: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const type = id.split("-")[0];
    const actualId = id.substring(type.length + 1);

    if (type === "booking")
      await prisma.booking.delete({ where: { id: actualId } });
    else if (type === "course")
      await prisma.courseBooking.delete({ where: { id: actualId } });

    logger.info(
      `[Schedule] Jadwal (${type}) berhasil dihapus. ID Jadwal: ${actualId}`,
    );
    res.status(200).json({ message: "Jadwal berhasil dihapus dari kalender!" });
  } catch (error) {
    logger.error(`[Schedule] Error deleteSchedule: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = { addSchedule, getAllSchedules, editSchedule, deleteSchedule };
