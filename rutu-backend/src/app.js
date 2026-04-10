const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const logger = require("./utils/logger");
const { getChatbotReply } = require("./services/chatbot.service");

const { globalLimiter } = require("./middlewares/rateLimit.middleware");

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const bookingRoutes = require("./routes/booking.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const chatRoutes = require("./routes/chat.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://ruang-tumbuh.vercel.app",
      "https://ruangtumbuh-production.up.railway.app"
    ];
    
    // Izinkan jika origin ada di daftar atau jika domain mengandung "vercel.app" (untuk preview)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// logging
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// limiter
app.use("/api", globalLimiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chatbot", chatbotRoutes);

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
      reply: "Maaf, server RuangTumbuh sedang sibuk. Coba lagi nanti ya!",
    });
  }
});

// 404
app.use((req, res) => {
  logger.warn(`Mencoba akses endpoint tidak valid: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "API Endpoint tidak ditemukan.",
  });
});

// error handler
const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
