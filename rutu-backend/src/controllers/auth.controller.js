const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const logger = require("../utils/logger");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const nameRegex = /^[a-zA-Z\s]*$/;
    const nameWords = name.trim().split(/\s+/);
    if (!nameRegex.test(name) || nameWords.length < 2 || nameWords.length > 5) {
      logger.warn(`[Register] Validasi nama gagal untuk email: ${email}`);
      return res
        .status(400)
        .json({
          message:
            "Nama lengkap harus berisi huruf saja, terdiri dari 2 hingga 5 kata.",
        });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,32}$/;
    if (!passwordRegex.test(password)) {
      logger.warn(`[Register] Validasi password lemah untuk email: ${email}`);
      return res
        .status(400)
        .json({
          message:
            "Password harus 8-32 karakter, wajib mengandung huruf besar, kecil, dan angka.",
        });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logger.warn(
        `[Register] Percobaan daftar dengan email yang sudah ada: ${email}`,
      );
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, timeBalance: 30 },
    });

    logger.info(
      `[Register] User baru berhasil mendaftar: ${newUser.id} (${email})`,
    );
    res
      .status(201)
      .json({
        message: "Registrasi berhasil!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
  } catch (error) {
    logger.error(`[Register] Error Server: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      logger.warn(`[Login] Percobaan login ke email tidak terdaftar: ${email}`);
      return res.status(404).json({ message: "Email tidak terdaftar!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`[Login] Password salah untuk user: ${user.id} (${email})`);
      return res.status(400).json({ message: "Password salah!" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "ruangtumbuh_secret_key",
      { expiresIn: "1d" },
    );

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
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = { register, login };
