require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const app = require("./src/app");

const prisma = require("./src/config/db");
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://ruang-tumbuh.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MIDDLEWARE SOCKET.IO: Validasi JWT sebelum terkoneksi
io.use((socket, next) => {
  // Ambil token yang dikirim dari Frontend
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Akses ditolak. Token tidak ada."));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Simpan info user ke dalam soket
    next();
  } catch (err) {
    return next(new Error("Token tidak valid."));
  }
});

io.on("connection", (socket) => {
  console.log(`🔌 User [${socket.user.name}] terkoneksi`);

  // User bergabung ke sebuah obrolan spesifik (Pribadi/Grup)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`[${socket.user.name}] bergabung ke room: ${roomId}`);
  });

  // Menerima pesan, SIMPAN ke DB, lalu sebarkan!
  socket.on("send_message", async (data) => {
    try {
      // Simpan pesan ke Supabase secara permanen
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

      // Pancarkan pesan ini HANYA ke user yang ada di Room tersebut
      io.to(data.roomId).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Gagal menyimpan pesan:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User [${socket.user.name}] terputus`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server & WebSockets berjalan pada Port: ${PORT}`);
});

server.on("error", (err) => console.error("❌ Error server:", err.message));
