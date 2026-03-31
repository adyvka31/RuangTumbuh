require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Konfigurasi Adapter PostgreSQL untuk Prisma v7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "rahasia-ruang-tumbuh-super-aman";

app.use(cors());
app.use(express.json());

// Endpoint Test
app.get("/api/test", (req, res) => {
  res.json({ message: "Server berhasil bertahan hidup!" });
});

// ==========================================
// ENDPOINT REGISTER
// ==========================================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah dipakai
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        timeBalance: 30, // Default 30 menit sesuai skema
      },
    });

    res.status(201).json({ message: "Registrasi berhasil!", user: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// ==========================================
// ENDPOINT LOGIN
// ==========================================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email atau password salah!" });
    }

    // Cek kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah!" });
    }

    // Buat Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }, // Token berlaku 1 hari
    );

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
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Server berjalan di http://localhost:${PORT}`,
  );
});

server.on("error", (err) => {
  console.error("❌ Express Error:", err.message);
});
