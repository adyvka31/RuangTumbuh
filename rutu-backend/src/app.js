const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const logger = require("./utils/logger");

const { globalLimiter } = require("./middlewares/rateLimit.middleware");

// Import semua routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const bookingRoutes = require("./routes/booking.routes");
const scheduleRoutes = require("./routes/schedule.routes");

const app = express();

// Middlewares Global
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()), // Arahkan morgan ke winston
    },
  }),
);

app.use("/api", globalLimiter);

// Daftarkan Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedules", scheduleRoutes);

// Penanganan URL tidak ditemukan (404 Fallback)
app.use((req, res) => {
  logger.warn(`Mencoba akses endpoint tidak valid: ${req.originalUrl}`); // Catat jika ada yang nyasar/hacker
  res.status(404).json({ message: "API Endpoint tidak ditemukan." });
});

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Izinkan port frontend Vite
  credentials: true,
};
app.use(cors(corsOptions));

const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
