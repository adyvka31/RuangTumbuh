const express = require("express");
const router = express.Router();
const prisma = require("./prismaClient");

// POST: Add new Course
router.post("/", async (req, res) => {
    try {
        const { name, tutorId, kategori, durasi, deskripsi, modules } = req.body;

        // Validation
        if (!name || !tutorId || !kategori || !durasi || !deskripsi) {
            return res.status(400).json({ message: "Semua field harus diisi!" });
        }

        // Cari nama tutor dari database berdasarkan ID
        const user = await prisma.user.findUnique({
            where: { id: tutorId }
        });

        if (!user) {
            return res.status(404).json({ message: "Tutor tidak ditemukan!" });
        }

        const newCourse = await prisma.course.create({
            data: {
                name,
                tutor: user.name, // Ambil nama asli dari database
                tutorId, // Simpan ID pembuat
                kategori,
                durasi: String(durasi),
                deskripsi,
                modules: modules || [], // Simpan daftar modul
            },
        });

        res.status(201).json({
            message: "Kursus berhasil ditambahkan ke Pusat Course!",
            course: newCourse,
        });
    } catch (error) {
        console.error("❌ ERROR SAAT TAMBAH KURSUS:", {
            message: error.message,
            code: error.code,
            stack: error.stack,
            meta: error.meta
        });
        res.status(500).json({
            message: "Terjadi kesalahan server saat menambahkan kursus",
            error: error.message,
            code: error.code // Kirim kode error prisma jika ada
        });
    }
});

// GET: All Courses (for SearchPage later)
router.get("/", async (req, res) => {
    try {
        const { tutorId } = req.query;
        let where = {};
        
        if (tutorId) {
            where.tutorId = tutorId;
        }

        const courses = await prisma.course.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error("❌ Fetch Courses Error:", error);
        res.status(500).json({
            message: "Terjadi kesalahan server saat mengambil data kursus",
            error: error.message,
        });
    }
});

// GET: Specific Course by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
        });

        if (!course) {
            return res.status(404).json({ message: "Kursus tidak ditemukan!" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("❌ Fetch Single Course Error:", error);
        res.status(500).json({
            message: "Terjadi kesalahan server saat mengambil data kursus",
            error: error.message,
        });
    }
});

// PUT: Update Course by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, kategori, durasi, deskripsi, modules } = req.body;

        if (!name || !kategori || !durasi || !deskripsi) {
            return res.status(400).json({ message: "Semua field harus diisi!" });
        }

        const updatedCourse = await prisma.course.update({
            where: { id: parseInt(id) },
            data: {
                name,
                kategori,
                durasi: String(durasi),
                deskripsi,
                modules: modules || [],
            },
        });

        res.status(200).json({
            message: "Kursus berhasil diperbarui!",
            course: updatedCourse,
        });
    } catch (error) {
        console.error("❌ Update Course Error:", error);
        res.status(500).json({
            message: "Terjadi kesalahan server saat memperbarui kursus",
            error: error.message,
        });
    }
});

// DELETE: Specific Course by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await prisma.course.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({
            message: "Kursus berhasil dihapus!",
            course: deletedCourse,
        });
    } catch (error) {
        console.error("❌ Delete Course Error:", error);
        res.status(500).json({
            message: "Terjadi kesalahan server saat menghapus kursus",
            error: error.message,
        });
    }
});

module.exports = router;
