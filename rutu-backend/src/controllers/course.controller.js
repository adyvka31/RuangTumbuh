const prisma = require("../config/db");
const logger = require("../utils/logger");

const createCourse = async (req, res) => {
  try {
    const { name, tutorId, kategori, durasi, deskripsi, modules } = req.body;

    if (!name || name.length < 5 || name.length > 100)
      return res
        .status(400)
        .json({ message: "Judul kursus harus 5-100 karakter." });
    if (!kategori)
      return res
        .status(400)
        .json({ message: "Kategori kursus wajib dipilih." });
    if (!durasi || isNaN(durasi) || parseInt(durasi) <= 0)
      return res
        .status(400)
        .json({ message: "Durasi kursus harus lebih dari 0 menit." });
    if (!deskripsi || deskripsi.length < 20 || deskripsi.length > 1000)
      return res
        .status(400)
        .json({ message: "Deskripsi kursus harus 20-1000 karakter." });
    if (!modules || !Array.isArray(modules) || modules.length === 0)
      return res.status(400).json({ message: "Kursus minimal 1 modul." });
    if (modules.length > 20)
      return res.status(400).json({ message: "Maksimal 20 modul per kursus." });

    const user = await prisma.user.findUnique({ where: { id: tutorId } });
    if (!user) {
      logger.warn(
        `[Course] Percobaan membuat kursus dengan Tutor ID tidak valid: ${tutorId}`,
      );
      return res.status(404).json({ message: "Tutor tidak ditemukan!" });
    }

    const newCourse = await prisma.course.create({
      data: {
        name,
        tutor: user.name,
        tutorId,
        kategori,
        durasi: String(durasi),
        deskripsi,
        modules,
      },
    });

    logger.info(
      `[Course] Kursus baru berhasil dibuat: ${newCourse.id} oleh ${tutorId}`,
    );
    res
      .status(201)
      .json({ message: "Kursus berhasil ditambahkan!", course: newCourse });
  } catch (error) {
    logger.error(`[Course] Error createCourse: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { tutorId, page = 1, limit = 6, search, category } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let where = {};
    if (tutorId) where.tutorId = tutorId;
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (category && category !== "Semua") where.kategori = category;

    const [courses, totalItems] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          tutor: true,
          tutorId: true,
          kategori: true,
          durasi: true,
          deskripsi: true,
          createdAt: true,
        },
      }),
      prisma.course.count({ where }),
    ]);

    logger.info(
      `[Course] Fetch daftar kursus. Page: ${page}, Search: ${search || "none"}`,
    );
    res
      .status(200)
      .json({
        data: courses,
        meta: {
          totalItems,
          totalPages: Math.ceil(totalItems / limitNumber),
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
  } catch (error) {
    logger.error(`[Course] Error getAllCourses: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (!course) {
      logger.warn(`[Course] Mencari kursus yang tidak ada: ID ${id}`);
      return res.status(404).json({ message: "Kursus tidak ditemukan!" });
    }

    logger.info(`[Course] Fetch detail kursus ID: ${id}`);
    res.status(200).json(course);
  } catch (error) {
    logger.error(`[Course] Error getCourseById: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, kategori, durasi, deskripsi, modules } = req.body;
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

    logger.info(`[Course] Kursus ID ${id} berhasil diperbarui.`);
    res
      .status(200)
      .json({ message: "Kursus berhasil diperbarui!", course: updatedCourse });
  } catch (error) {
    logger.error(`[Course] Error updateCourse: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    logger.info(`[Course] Kursus ID ${id} berhasil dihapus.`);
    res
      .status(200)
      .json({ message: "Kursus berhasil dihapus!", course: deletedCourse });
  } catch (error) {
    logger.error(`[Course] Error deleteCourse: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
