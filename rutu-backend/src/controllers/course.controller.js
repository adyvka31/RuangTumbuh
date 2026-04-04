const prisma = require("../config/db");

const createCourse = async (req, res) => {
  try {
    const { name, tutorId, kategori, durasi, deskripsi, modules } = req.body;
    const user = await prisma.user.findUnique({ where: { id: tutorId } });
    if (!user)
      return res.status(404).json({ message: "Tutor tidak ditemukan!" });

    const newCourse = await prisma.course.create({
      data: {
        name,
        tutor: user.name,
        tutorId,
        kategori,
        durasi: String(durasi),
        deskripsi,
        modules: modules || [],
      },
    });
    res
      .status(201)
      .json({ message: "Kursus berhasil ditambahkan!", course: newCourse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { tutorId } = req.query;
    let where = tutorId ? { tutorId } : {};
    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(courses);
  } catch (error) {
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
    if (!course)
      return res.status(404).json({ message: "Kursus tidak ditemukan!" });
    res.status(200).json(course);
  } catch (error) {
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
    res
      .status(200)
      .json({ message: "Kursus berhasil diperbarui!", course: updatedCourse });
  } catch (error) {
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
    res
      .status(200)
      .json({ message: "Kursus berhasil dihapus!", course: deletedCourse });
  } catch (error) {
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
