const rateLimit = require("express-rate-limit");

// 1. GLOBAL LIMITER (Untuk mencegah spam umum ke server)
// Aturan: Maksimal 100 request per 15 menit dari 1 IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Batasi setiap IP hingga 100 request per windowMs
  message: {
    message:
      "Terlalu banyak interaksi dari perangkat Anda. Mohon tunggu beberapa saat dan coba lagi.",
  },
  standardHeaders: true, // Mengembalikan info limit di header `RateLimit-*`
  legacyHeaders: false, // Nonaktifkan header lama
});

// 2. AUTH LIMITER (Sangat Ketat: Mencegah Brute Force Login/Register)
// Aturan: Maksimal 10x percobaan per 15 menit dari 1 IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Hanya boleh 10x percobaan login/register
  message: {
    message:
      "Terlalu banyak percobaan masuk. Demi keamanan, silakan coba lagi setelah 15 menit.",
  },
});

module.exports = { globalLimiter, authLimiter };
