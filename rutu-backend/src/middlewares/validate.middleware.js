const logger = require("../utils/logger");

const validate = (schema) => (req, res, next) => {
  try {
    // Zod akan mengecek apakah data dari request sesuai dengan schema
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next(); // Lanjut ke controller jika validasi sukses
  } catch (err) {
    // Jika gagal, tangkap error dari Zod dan rapikan formatnya
    logger.warn(
      `[Validation Error] Pengecekan input gagal di path: ${req.originalUrl}`,
    );

    const formattedErrors = err.errors.map((e) => ({
      field: e.path[1], // Mengambil nama field yang error (misal: "password")
      message: e.message,
    }));

    return res.status(400).json({
      message: "Validasi data gagal!",
      errors: formattedErrors,
    });
  }
};

module.exports = validate;
