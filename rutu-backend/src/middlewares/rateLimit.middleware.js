const rateLimit = require("express-rate-limit");

// 1. GLOBAL LIMITER (Untuk Endpoint Biasa: Search, Profile, Course)
// Aturan: Maksimal 300 request per 5 menit dari 1 IP.
// 300 / 5 menit = 1 request per detik secara konstan.
// Ini sangat cukup untuk user asli yang mengetik cepat atau pindah-pindah tab.
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 300,
  message: {
    message:
      "Terlalu banyak permintaan data. Sistem sedang menstabilkan koneksi, silakan coba lagi dalam beberapa menit.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. AUTH LIMITER (Sangat Ketat: Hanya untuk Login & Register)
// Aturan: Maksimal 15x percobaan per 15 menit dari 1 IP.
// Mencegah hacker menebak password berulang kali (Brute Force).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15,
  message: {
    message:
      "Terlalu banyak percobaan masuk. Demi keamanan akun Anda, silakan coba lagi setelah 15 menit.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. API SPECIFIC LIMITER (Opsional untuk endpoint tertentu yang berat)
// Contoh: Pembuatan kursus baru
const createCourseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 10, // Maksimal 10 kursus per jam dari 1 IP
  message: {
    message:
      "Anda telah mencapai batas pembuatan kursus harian. Istirahat sejenak!",
  },
});

module.exports = { globalLimiter, authLimiter, createCourseLimiter };
