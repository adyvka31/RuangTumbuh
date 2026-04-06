const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`[Global Error] ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;

  // Format respons distandardisasi dengan "success: false"
  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 ? "Terjadi kesalahan internal server" : err.message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // Stack trace hanya muncul di development
  });
};

module.exports = errorHandler;
