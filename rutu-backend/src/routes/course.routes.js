const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");

// Import middleware dan schema
const validate = require("../middlewares/validate.middleware");
const {
  createCourseSchema,
  updateCourseSchema,
  getCourseQuerySchema,
} = require("../validations/course.validation");

router.post("/", validate(createCourseSchema), courseController.createCourse);
router.get("/", validate(getCourseQuerySchema), courseController.getAllCourses);
router.get("/:id", courseController.getCourseById); 
router.put("/:id", validate(updateCourseSchema), courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
