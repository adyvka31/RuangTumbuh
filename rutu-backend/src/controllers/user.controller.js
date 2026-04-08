const logger = require("../utils/logger");
const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

const prisma = require("../config/db");

const getProfile = catchAsync(async (req, res) => {
  const profile = await userService.getUserProfile(req.params.id);
  logger.info(`[User] Data profil berhasil dimuat untuk ID: ${req.params.id}`);

  res
    .status(200)
    .json({ success: true, message: "Profil dimuat", data: profile });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

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

  res.status(200).json({
    success: true,
    message: "Profil berhasil diperbarui!",
    data: updatedUser,
  });
});

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await userService.getDashboardStats(req.params.id);
  logger.info(`[Dashboard] Stats berhasil dimuat untuk ID: ${req.params.id}`);

  res
    .status(200)
    .json({ success: true, message: "Statistik dimuat", data: stats });
});

const searchUsers = catchAsync(async (req, res) => {
  const { q } = req.query;
  const currentUserId = req.user.id; // Didapat dari authMiddleware

  if (!q) return res.status(200).json({ success: true, data: [] });

  const users = await prisma.user.findMany({
    where: {
      id: { not: currentUserId }, // Jangan tampilkan diri sendiri
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } }, // Bisa digunakan untuk role
        { school: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, profilePicture: true, description: true },
    take: 10, // Batasi hanya 10 hasil agar respon cepat
  });

  res.status(200).json({ success: true, data: users });
});

module.exports = { getProfile, updateProfile, getDashboardStats, searchUsers };
