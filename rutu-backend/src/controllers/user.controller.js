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
    let updateData = { ...req.body };

    // Parse passions jika dikirim sebagai stringified JSON
    if (typeof updateData.passions === "string") {
      try {
        updateData.passions = JSON.parse(updateData.passions);
      } catch (e) {
        updateData.passions = [];
      }
    }

    if (req.file) updateData.profilePicture = `/uploads/${req.file.filename}`;

    const updatedUser = await userService.updateUserProfile(id, updateData);
    logger.info(`[User] Profil berhasil diperbarui untuk ID: ${id}`);
    res
      .status(200)
      .json({ message: "Profil berhasil diperbarui!", user: updatedUser });
  } catch (error) {
    logger.error(`[User] Error updateProfile: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Terjadi kesalahan server" });
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await userService.getDashboardStats(req.params.id);
    logger.info(`[Dashboard] Stats berhasil dimuat untuk ID: ${req.params.id}`);
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
