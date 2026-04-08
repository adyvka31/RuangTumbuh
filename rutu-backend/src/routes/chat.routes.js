const express = require("express");
const { verifyToken } = require("../middlewares/auth.middleware");
const chatController = require("../controllers/chat.controller");

const router = express.Router();

// Proteksi semua jalur ini agar wajib login menggunakan verifyToken
router.use(verifyToken);

router.get("/rooms", chatController.getChatRooms);
router.get("/:roomId/messages", chatController.getMessages);
router.post("/private", chatController.getOrCreatePrivateRoom);

module.exports = router;
