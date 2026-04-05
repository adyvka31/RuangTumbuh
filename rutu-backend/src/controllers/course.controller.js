const logger = require("../utils/logger");
const courseService = require("../services/course.service");

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createNewCourse(req.body);
    logger.info(`[Course] Kursus baru dibuat: ${course.id}`);
    res.status(201).json({ message: "Kursus berhasil ditambahkan!", course });
  } catch (error) {
    logger.error(`[Course] Error createCourse: ${error.message}`);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const data = await courseService.getCoursesList(req.query);
    res
      .status(200)
      .json({
        data: data.courses,
        meta: {
          totalItems: data.totalItems,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          limit: data.limit,
        },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseDetail(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await courseService.updateCourseData(
      req.params.id,
      req.body,
    );
    res
      .status(200)
      .json({ message: "Kursus diperbarui!", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await courseService.removeCourse(req.params.id);
    res.status(200).json({ message: "Kursus dihapus!", course: deletedCourse });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
