const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Format tampilan log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
  }),
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // 1. Simpan SEMUA error ke dalam file khusus error (error-2024-05-12.log)
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d", // Otomatis hapus file log yang usianya lebih dari 14 hari
    }),

    // 2. Simpan SEMUA aktivitas (info, peringatan, dll) ke file combined
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),

    // 3. Tetap tampilkan di terminal/konsol dengan warna-warni yang rapi
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  ],
});

module.exports = logger;
