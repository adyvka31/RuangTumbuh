const logger = require("../utils/logger");
const courseService = require("../services/course.service");

const createCourse = async (req, res) => {
  try {
    const course = await courseService.createNewCourse(req.body);
    logger.info(`[Course] Kursus baru berhasil dibuat: ${course.id}`);
    res.status(201).json({
      success: true,
      message: "Kursus berhasil ditambahkan!",
      data: course,
    });
  } catch (error) {
    logger.error(`[Course] Error createCourse: ${error.message}`, {
      stack: error.stack,
    });
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan server",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const data = await courseService.getCoursesList(req.query);
    logger.info(`[Course] Fetch daftar kursus. Page: ${req.query.page || 1}`);
    res.status(200).json({
      success: true,
      message: "Daftar kursus berhasil dimuat",
      data: data.courses,
      meta: {
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        limit: data.limit,
      },
    });
  } catch (error) {
    logger.error(`[Course] Error getAllCourses: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseDetail(req.params.id);
    logger.info(`[Course] Fetch detail kursus ID: ${req.params.id}`);
    res
      .status(200)
      .json({
        success: true,
        message: "Detail kursus ditemukan",
        data: course,
      });
  } catch (error) {
    logger.error(`[Course] Error getCourseById: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message: error.message || "Terjadi kesalahan server",
      });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await courseService.updateCourseData(
      req.params.id,
      req.body,
    );
    logger.info(`[Course] Kursus ID ${req.params.id} berhasil diperbarui.`);
    res
      .status(200)
      .json({
        success: true,
        message: "Kursus berhasil diperbarui!",
        data: updatedCourse,
      });
  } catch (error) {
    logger.error(`[Course] Error updateCourse: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await courseService.removeCourse(req.params.id);
    logger.info(`[Course] Kursus ID ${req.params.id} berhasil dihapus.`);
    res
      .status(200)
      .json({
        success: true,
        message: "Kursus berhasil dihapus!",
        data: deletedCourse,
      });
  } catch (error) {
    logger.error(`[Course] Error deleteCourse: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
