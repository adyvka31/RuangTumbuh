const logger = require("../utils/logger");
const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validasi Input (Nantinya ini bisa dipindah ke Middleware Zod/Joi)
    const nameRegex = /^[a-zA-Z\s]*$/;
    const nameWords = name.trim().split(/\s+/);
    if (!nameRegex.test(name) || nameWords.length < 2 || nameWords.length > 5) {
      logger.warn(`[Register] Validasi nama gagal untuk email: ${email}`);
      return res.status(400).json({
        message:
          "Nama lengkap harus berisi huruf saja, terdiri dari 2 hingga 5 kata.",
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,32}$/;
    if (!passwordRegex.test(password)) {
      logger.warn(`[Register] Validasi password lemah untuk email: ${email}`);
      return res.status(400).json({
        message:
          "Password harus 8-32 karakter, wajib mengandung huruf besar, kecil, dan angka.",
      });
    }

    // 2. Panggil Service untuk Logika Bisnis
    const newUser = await authService.registerUser({ name, email, password });

    logger.info(
      `[Register] User baru berhasil mendaftar: ${newUser.id} (${email})`,
    );

    // 3. Kirim Response
    res.status(201).json({
      message: "Registrasi berhasil!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    logger.error(`[Register] Error Server: ${error.message}`, {
      stack: error.stack,
    });

    // Gunakan custom statusCode dari service jika ada, jika tidak default ke 500
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: statusCode !== 500 ? error.message : "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Panggil Service untuk proses Login
    const { user, token } = await authService.loginUser({ email, password });

    logger.info(`[Login] User berhasil login: ${user.id} (${email})`);
    res.status(200).json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timeBalance: user.timeBalance,
      },
    });
  } catch (error) {
    logger.error(`[Login] Error Server: ${error.message}`, {
      stack: error.stack,
    });

    // Gunakan custom statusCode dari service jika ada, jika tidak default ke 500
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: statusCode !== 500 ? error.message : "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

module.exports = { register, login };
