const logger = require("../utils/logger");
const scheduleService = require("../services/schedule.service");

const addSchedule = async (req, res) => {
  try {
    const newSchedule = await scheduleService.addSelfSchedule(req.body);
    logger.info(
      `[Schedule] Jadwal mandiri berhasil dibuat oleh User ID: ${req.body.studentId}`,
    );
    res
      .status(201)
      .json({ message: "Jadwal berhasil ditambahkan!", schedule: newSchedule });
  } catch (error) {
    logger.error(`[Schedule] Error addSchedule: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.fetchAllSchedules(req.params.id);
    logger.info(
      `[Schedule] Data kalender diambil untuk User ID: ${req.params.id}`,
    );
    res.status(200).json(schedules);
  } catch (error) {
    logger.error(`[Schedule] Error getAllSchedules: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Gagal mengambil data jadwal" });
  }
};

const editSchedule = async (req, res) => {
  try {
    const type = req.params.id.split("-")[0];
    const actualId = req.params.id.substring(type.length + 1);
    await scheduleService.modifySchedule(type, actualId, req.body);

    logger.info(
      `[Schedule] Jadwal (${type}) berhasil di-reschedule. ID Jadwal: ${actualId}`,
    );
    res.status(200).json({ message: "Jadwal berhasil di-reschedule!" });
  } catch (error) {
    logger.error(`[Schedule] Error editSchedule: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const type = req.params.id.split("-")[0];
    const actualId = req.params.id.substring(type.length + 1);
    await scheduleService.removeScheduleData(type, actualId);

    logger.info(
      `[Schedule] Jadwal (${type}) berhasil dihapus. ID Jadwal: ${actualId}`,
    );
    res.status(200).json({ message: "Jadwal berhasil dihapus dari kalender!" });
  } catch (error) {
    logger.error(`[Schedule] Error deleteSchedule: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { addSchedule, getAllSchedules, editSchedule, deleteSchedule };
