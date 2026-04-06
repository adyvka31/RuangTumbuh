const logger = require("../utils/logger");
const scheduleService = require("../services/schedule.service");
const catchAsync = require("../utils/catchAsync");

const addSchedule = catchAsync(async (req, res) => {
  const newSchedule = await scheduleService.addSelfSchedule(req.body);
  logger.info(
    `[Schedule] Jadwal mandiri berhasil dibuat oleh User ID: ${req.body.studentId}`,
  );

  res
    .status(201)
    .json({
      success: true,
      message: "Jadwal berhasil ditambahkan!",
      data: newSchedule,
    });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const schedules = await scheduleService.fetchAllSchedules(req.params.id);
  logger.info(
    `[Schedule] Data kalender diambil untuk User ID: ${req.params.id}`,
  );

  res
    .status(200)
    .json({
      success: true,
      message: "Jadwal berhasil dimuat",
      data: schedules,
    });
});

const editSchedule = catchAsync(async (req, res) => {
  const type = req.params.id.split("-")[0];
  const actualId = req.params.id.substring(type.length + 1);

  await scheduleService.modifySchedule(type, actualId, req.body);
  logger.info(
    `[Schedule] Jadwal (${type}) berhasil di-reschedule. ID Jadwal: ${actualId}`,
  );

  res
    .status(200)
    .json({ success: true, message: "Jadwal berhasil di-reschedule!" });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const type = req.params.id.split("-")[0];
  const actualId = req.params.id.substring(type.length + 1);

  await scheduleService.removeScheduleData(type, actualId);
  logger.info(
    `[Schedule] Jadwal (${type}) berhasil dihapus. ID Jadwal: ${actualId}`,
  );

  res
    .status(200)
    .json({ success: true, message: "Jadwal berhasil dihapus dari kalender!" });
});

module.exports = { addSchedule, getAllSchedules, editSchedule, deleteSchedule };
