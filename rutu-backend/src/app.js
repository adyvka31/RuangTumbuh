const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const logger = require("./utils/logger");

const { globalLimiter } = require("./middlewares/rateLimit.middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const bookingRoutes = require("./routes/booking.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const chatbotRoutes = require("./routes/chatbot.routes");


const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ruang-tumbuh.vercel.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.use("/api", globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((req, res) => {
  logger.warn(`Mencoba akses endpoint tidak valid: ${req.originalUrl}`);
  res
    .status(404)
    .json({ success: false, message: "API Endpoint tidak ditemukan." });
});

const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
