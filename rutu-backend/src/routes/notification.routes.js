const express = require("express");
const router = express.Router();
const prisma = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const { verifyToken } = require("../middlewares/auth.middleware");

// Ambil semua notifikasi untuk user yang sedang login
router.get(
  "/",
  verifyToken,
  catchAsync(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: notifications });
  }),
);

module.exports = router;
