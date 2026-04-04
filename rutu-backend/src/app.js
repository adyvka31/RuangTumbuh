const express = require("express");
const cors = require("cors");
const path = require("path");

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

// Daftarkan Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);          
app.use("/api/courses", courseRoutes);      
app.use("/api/bookings", bookingRoutes);     
app.use("/api/schedules", scheduleRoutes);

// Penanganan URL tidak ditemukan (404 Fallback)
app.use((req, res) => {
  res.status(404).json({ message: "API Endpoint tidak ditemukan." });
});

module.exports = app;
