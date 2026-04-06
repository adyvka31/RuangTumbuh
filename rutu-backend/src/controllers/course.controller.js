const logger = require("../utils/logger");
const courseService = require("../services/course.service");
const catchAsync = require("../utils/catchAsync");

const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createNewCourse(req.body);
  logger.info(`[Course] Kursus baru berhasil dibuat: ${course.id}`);
  
  res.status(201).json({ success: true, message: "Kursus berhasil ditambahkan!", data: course });
});

const getAllCourses = catchAsync(async (req, res) => {
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
});

const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseDetail(req.params.id);
  logger.info(`[Course] Fetch detail kursus ID: ${req.params.id}`);
  
  res.status(200).json({ success: true, message: "Detail kursus ditemukan", data: course });
});

const updateCourse = catchAsync(async (req, res) => {
  const updatedCourse = await courseService.updateCourseData(req.params.id, req.body);
  logger.info(`[Course] Kursus ID ${req.params.id} berhasil diperbarui.`);
  
  res.status(200).json({ success: true, message: "Kursus berhasil diperbarui!", data: updatedCourse });
});

const deleteCourse = catchAsync(async (req, res) => {
  const deletedCourse = await courseService.removeCourse(req.params.id);
  logger.info(`[Course] Kursus ID ${req.params.id} berhasil dihapus.`);
  
  res.status(200).json({ success: true, message: "Kursus berhasil dihapus!", data: deletedCourse });
});

module.exports = { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };