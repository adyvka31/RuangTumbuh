const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const registerUser = async ({ name, email, password }) => {
  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error("Email sudah terdaftar!");
    error.statusCode = 400; // Beri status 400 (Bad Request)
    throw error;
  }

  // Hash password dan simpan ke database
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, timeBalance: 30 },
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
  // Cek apakah user ada
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Email tidak terdaftar!");
    error.statusCode = 404; // Beri status 404 (Not Found)
    throw error;
  }

  // Cek kecocokan password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Password salah!");
    error.statusCode = 400;
    throw error;
  }

  // Generate Token JWT
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "ruangtumbuh_secret_key", // Catatan: perbaiki fallback secret key ini nanti ke environment variable yang lebih aman
    { expiresIn: "1d" },
  );

  return { user, token };
};

module.exports = { registerUser, loginUser };
