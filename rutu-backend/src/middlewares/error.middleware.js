const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`[Global Error] ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message:
      statusCode === 500 ? "Terjadi kesalahan internal server" : err.message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined, // Sembunyikan detail error di production
  });
};

module.exports = errorHandler;
