const logger = require("../utils/logger");
const scheduleService = require("../services/schedule.service");

const addSchedule = async (req, res) => {
  try {
    const newSchedule = await scheduleService.addSelfSchedule(req.body);
    res
      .status(201)
      .json({ message: "Jadwal berhasil ditambahkan!", schedule: newSchedule });
  } catch (error) {
    logger.error(`[Schedule] Error: ${error.message}`);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.fetchAllSchedules(req.params.id);
    res.status(200).json(schedules);
  } catch (error) {
    logger.error(`[Schedule] Error fetch: ${error.message}`);
    res.status(500).json({ message: "Gagal mengambil data jadwal" });
  }
};

const editSchedule = async (req, res) => {
  try {
    const type = req.params.id.split("-")[0];
    const actualId = req.params.id.substring(type.length + 1);
    await scheduleService.modifySchedule(type, actualId, req.body);
    res.status(200).json({ message: "Jadwal berhasil di-reschedule!" });
  } catch (error) {
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
    res.status(200).json({ message: "Jadwal berhasil dihapus dari kalender!" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { addSchedule, getAllSchedules, editSchedule, deleteSchedule };
