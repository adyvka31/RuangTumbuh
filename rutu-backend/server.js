import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";

// Import custom modules
import prisma from "./src/config/db.js";
import { getChatbotReply } from "./src/services/chatbot.service.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// 1. MIDDLEWARE & CONFIG
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ruang-tumbuh.vercel.app",
  ],
  credentials: true
}));
app.use(express.json());

console.log("=== Konfigurasi RuangTumbuh ===");
console.log("Cek API Key:", process.env.GEMINI_API_KEY ? "✅ Terdeteksi" : "❌ Tidak Terdeteksi");

// 2. SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://ruang-tumbuh.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Auth Middleware untuk Socket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Akses ditolak. Token tidak ada."));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Token tidak valid."));
  }
});

io.on("connection", (socket) => {
  console.log(`🔌 User [${socket.user.name}] terkoneksi`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`[${socket.user.name}] bergabung ke room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await prisma.message.create({
        data: {
          text: data.text,
          senderId: socket.user.id,
          roomId: data.roomId,
        },
        include: {
          sender: { select: { id: true, name: true, profilePicture: true } },
        },
      });
      io.to(data.roomId).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Gagal menyimpan pesan:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User [${socket.user.name}] terputus`);
  });
});

// 3. ENDPOINT CHATBOT AI
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ success: false, error: "Pesan kosong" });
    }

    const reply = await getChatbotReply(message);
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Error pada endpoint /api/chatbot:", error.message);
    res.status(500).json({ 
      success: false, 
      reply: "Maaf, server RuangTumbuh sedang sibuk. Coba lagi nanti ya!" 
    });
  }
});

// 4. JALANKAN SERVER
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server & WebSockets RuangTumbuh jalan di port: ${PORT}`);
});

server.on("error", (err) => console.error("❌ Error server:", err.message));