const logger = require("../utils/logger");
const userService = require("../services/user.service");

const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.params.id);
    logger.info(
      `[User] Data profil berhasil dimuat untuk ID: ${req.params.id}`,
    );
    res.status(200).json(profile);
  } catch (error) {
    logger.error(`[User] Error getProfile: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { name, location, birthday, school, description, passions } = req.body;

    // Validasi sederhana (sebaiknya nanti dipindah ke Middleware Zod)
    if (name) {
      const nameWords = name.trim().split(/\s+/);
      if (
        !/^[a-zA-Z\s]*$/.test(name) ||
        nameWords.length < 2 ||
        nameWords.length > 5
      )
        return res.status(400).json({ message: "Nama tidak valid." });
    }
    let parsedPassions = [];
    if (typeof passions === "string") {
      try {
        parsedPassions = JSON.parse(passions);
      } catch (e) {}
    } else if (Array.isArray(passions)) {
      parsedPassions = passions;
    }

    const updateData = {
      name,
      location,
      birthday,
      school,
      description,
      passions: parsedPassions,
    };
    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;

    const updatedUser = await userService.updateUserProfile(id, updateData);
    logger.info(`[User] Profil diperbarui untuk ID: ${id}`);
    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui!", user: updatedUser });
  } catch (error) {
    logger.error(`[User] Error updateProfile: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await userService.getDashboardStats(req.params.id);
    logger.info(`[Dashboard] Stats dimuat untuk ID: ${req.params.id}`);
    res.status(200).json(stats);
  } catch (error) {
    logger.error(`[Dashboard] Error getDashboardStats: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Error fetch dashboard stats" });
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
