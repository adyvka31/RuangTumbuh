const express = require("express");
const router = express.Router();
const prisma = require("./prismaClient");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Simpan di folder uploads/
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// GET: Ambil Data Profile Berdasarkan ID
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Ambil data dasar user
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
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    user.passions = user.passions || [];

    // ==========================================
    // MENGHITUNG STATISTIK PROFIL
    // ==========================================

    // 2. Sesi Mengajar (Jumlah Course yang Dibuat Sendiri oleh User)
    const teachingSessions = await prisma.course.count({
      where: { tutorId: id },
    });

    // 3. Menit Belajar (Sesi 1-on-1) -> Hanya hitung yang sudah SELESAI (COMPLETED)
    const my1on1Bookings = await prisma.booking.findMany({
      where: {
        studentId: id,
        status: "COMPLETED",
      },
    });

    let total1on1Minutes = 0;
    my1on1Bookings.forEach((session) => {
      total1on1Minutes += session.durationMinutes || 0;
    });

    // 4. Menit Belajar (Sesi Course/Kelas) -> Hanya hitung yang DITERIMA (ACCEPTED)
    const myCourseBookings = await prisma.courseBooking.findMany({
      where: {
        studentId: id,
        status: "ACCEPTED",
      },
      include: { course: true },
    });

    let totalCourseMinutes = 0;
    myCourseBookings.forEach((booking) => {
      if (booking.course && booking.course.durasi) {
        // Ekstrak angka dari string "120 Menit" menjadi 120
        const mins = parseInt(booking.course.durasi.replace(/\D/g, "")) || 0;
        totalCourseMinutes += mins;
      }
    });

    // 5. Total keseluruhan menit
    const learningMinutes = total1on1Minutes + totalCourseMinutes;

    // 6. Gabungkan statistik ke dalam response
    const userWithStats = {
      ...user,
      stats: {
        learningMinutes,
        teachingSessions,
      },
    };

    res.status(200).json(userWithStats);
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// PUT: Update Data Profile
router.put("/profile/:id", upload.single("avatar"), async (req, res) => {
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

    // Data yang akan diupdate
    const updateData = {
      name,
      location,
      birthday,
      school,
      description,
      passions: passions || [],
    };

    // Jika user mengupload gambar baru, req.file akan berisi data file
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui!", user: updatedUser });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// GET: Ambil Statistik untuk Dashboard
router.get("/dashboard-stats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();

    // 1. Ambil Saldo Waktu (Dompet Waktu)
    const user = await prisma.user.findUnique({
      where: { id },
      select: { timeBalance: true },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // 2. Hitung Durasi Belajar
    const completed1on1 = await prisma.booking.findMany({
      where: { studentId: id, status: "COMPLETED" }, // Booking boleh COMPLETED
    });
    const acceptedCourses = await prisma.courseBooking.findMany({
      // PERBAIKAN: Ubah COMPLETED jadi ACCEPTED
      where: { studentId: id, status: "ACCEPTED" },
      include: { course: true },
    });

    let learningMinutes = 0;
    completed1on1.forEach((b) => (learningMinutes += b.durationMinutes || 0));
    acceptedCourses.forEach((b) => {
      if (b.course && b.course.durasi) {
        learningMinutes += parseInt(b.course.durasi.replace(/\D/g, "")) || 0;
      }
    });

    // 3. Hitung Sesi Mendatang (Count / Jumlah Saja)
    const upcoming1on1 = await prisma.booking.count({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
    });
    const upcomingCourses = await prisma.courseBooking.count({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
    });

    // 4. Hitung Sesi Selesai (Count / Jumlah Saja)
    const finished1on1 = await prisma.booking.count({
      where: { studentId: id, status: "COMPLETED" }, // Booking boleh COMPLETED
    });
    const finishedCourses = await prisma.courseBooking.count({
      // PERBAIKAN: Ubah COMPLETED jadi ACCEPTED (karena CourseBooking tidak punya COMPLETED)
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { lt: now } },
    });

    // Ambil maksimal 3 jadwal terdekat dari tabel Booking (1-on-1)
    const upcoming1on1List = await prisma.booking.findMany({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
      include: { skill: true },
      orderBy: { scheduledAt: "asc" },
    });

    // Ambil maksimal 3 jadwal terdekat dari tabel CourseBooking (Kelas)
    const upcomingCourseList = await prisma.courseBooking.findMany({
      where: { studentId: id, status: "ACCEPTED", scheduledAt: { gt: now } },
      include: { course: true },
      orderBy: { scheduledAt: "asc" },
    });

    // Gabungkan kedua list menjadi format seragam untuk Frontend
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

    // Urutkan berdasarkan waktu paling dekat dan ambil maksimal 3 sesi
    const mentoringSessions = rawSessions.sort(
      (a, b) => new Date(a.time) - new Date(b.time),
    );

    // Kirim seluruh data ke frontend
    res.json({
      timeBalance: user.timeBalance,
      learningMinutes: learningMinutes,
      upcomingSessions: upcoming1on1 + upcomingCourses,
      completedSessions: finished1on1 + finishedCourses,
      mentoringSessions: mentoringSessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetch dashboard stats" });
  }
});

// POST: Tambah Jadwal Mandiri (Sesi Buatan Sendiri)
router.post("/schedule/add", async (req, res) => {
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

    if (!studentId || !date || !time) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Gabungkan Tanggal dan Waktu
    const scheduledAt = new Date(`${date}T${time}:00`);

    // Karena ini jadwal mandiri, kita simpan data custom (title, dll) ke dalam kolom 'notes'
    // Format JSON stringified agar bisa dibaca nanti
    const customData = JSON.stringify({ title, category, platform, partner });

    const newSchedule = await prisma.booking.create({
      data: {
        studentId: studentId,
        tutorId: studentId, // Jadwal mandiri ditautkan ke diri sendiri
        status: "ACCEPTED", // Langsung masuk ke kalender
        scheduledAt: scheduledAt,
        durationMinutes: parseInt(durationMinutes) || 60,
        meetingLink: platform,
        notes: customData, // <--- Metadata form disimpan di sini
      },
    });

    res
      .status(201)
      .json({ message: "Jadwal berhasil ditambahkan!", schedule: newSchedule });
  } catch (error) {
    console.error("❌ Add Schedule Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// GET: Ambil Semua Jadwal Untuk Kalender
router.get("/schedule/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const my1on1Bookings = await prisma.booking.findMany({
      where: { studentId: id },
      include: { skill: true },
    });

    const myCourseBookings = await prisma.courseBooking.findMany({
      where: { studentId: id },
      include: { course: true },
    });

    const allSchedules = [
      ...my1on1Bookings.map((b) => {
        const startDate = new Date(b.scheduledAt);
        const duration = b.durationMinutes || 60;
        const endDate = new Date(startDate.getTime() + duration * 60000);

        // --- UPDATE PENTING: Mengecek apakah ini jadwal buatan sendiri (punya notes) ---
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
          // Jika meta.title ada, pakai itu. Jika tidak, pakai bawaan database.
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
        // ... (Logika myCourseBookings TEPAT SAMA SEPERTI SEBELUMNYA) ...
        const startDate = new Date(b.scheduledAt);
        const durationStr =
          b.course && b.course.durasi
            ? b.course.durasi.replace(/\D/g, "")
            : "60";
        const duration = parseInt(durationStr) || 60;
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

    res.status(200).json(allSchedules);
  } catch (error) {
    console.error("Error fetch schedule:", error);
    res.status(500).json({ message: "Gagal mengambil data jadwal" });
  }
});

// PUT: Edit Jadwal Mandiri (Reschedule)
router.put("/schedule/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // PERBAIKAN: Ambil kata pertama (booking/course), lalu ambil sisa string sebagai UUID asli
    const type = id.split("-")[0];
    const actualId = id.substring(type.length + 1);

    const { title, date, time, durationMinutes, category, platform, partner } =
      req.body;

    const safeTime = time.replace(".", ":");
    const scheduledAt = new Date(`${date}T${safeTime}:00`);

    const customData = JSON.stringify({ title, category, platform, partner });

    if (type === "booking") {
      await prisma.booking.update({
        where: { id: actualId }, // <--- Sekarang UUID-nya utuh
        data: {
          scheduledAt,
          durationMinutes: parseInt(durationMinutes) || 60,
          meetingLink: platform,
          notes: customData,
        },
      });
    } else if (type === "course") {
      await prisma.courseBooking.update({
        where: { id: actualId }, // <--- Sekarang UUID-nya utuh
        data: {
          scheduledAt,
          note: customData,
        },
      });
    }

    res.status(200).json({ message: "Jadwal berhasil di-reschedule!" });
  } catch (error) {
    console.error("❌ Edit Schedule Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// DELETE: Hapus Jadwal dari Kalender
router.delete("/schedule/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // PERBAIKAN: Lakukan pemisahan string yang aman untuk UUID
    const type = id.split("-")[0];
    const actualId = id.substring(type.length + 1);

    if (type === "booking") {
      await prisma.booking.delete({ where: { id: actualId } });
    } else if (type === "course") {
      await prisma.courseBooking.delete({ where: { id: actualId } });
    }

    res.status(200).json({ message: "Jadwal berhasil dihapus dari kalender!" });
  } catch (error) {
    console.error("❌ Delete Schedule Error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

module.exports = router;
