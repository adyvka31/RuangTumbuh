const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");

// Import middleware dan schema
const validate = require("../middlewares/validate.middleware");
const {
  addScheduleSchema,
  editScheduleSchema,
} = require("../validations/schedule.validation");

router.post("/", validate(addScheduleSchema), scheduleController.addSchedule);
router.get("/:id", scheduleController.getAllSchedules);
router.put(
  "/:id",
  validate(editScheduleSchema),
  scheduleController.editSchedule,
);
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
