const prisma = require("../config/db"); // Sesuaikan dengan path instance prisma Anda

const createNotification = async (userId, title, message, type) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  } catch (error) {
    console.error("[Notification] Gagal membuat notifikasi:", error);
  }
};

module.exports = { createNotification };
