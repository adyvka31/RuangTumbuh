const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");

// POST /api/schedules
router.post("/", scheduleController.addSchedule);

// GET /api/schedules/user/:id (Mengambil seluruh jadwal milik 1 user spesifik)
router.get("/user/:id", scheduleController.getAllSchedules);

// PUT /api/schedules/:id
router.put("/:id", scheduleController.editSchedule);

// DELETE /api/schedules/:id
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
