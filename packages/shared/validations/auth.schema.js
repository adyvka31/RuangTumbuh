const { z } = require("zod");

// 1. Import langsung dari package shared
const shared = require("@rutu/shared");

// (Opsional) Baris ini akan mencetak isi shared ke log Railway Anda jika terjadi error lagi
if (!shared.registerPayloadSchema || !shared.loginPayloadSchema) {
  console.error("🚨 GAGAL MEMUAT SCHEMA. Isi @rutu/shared:", shared);
}

// 2. Masukkan ke dalam skema validasi Express
const registerSchema = z.object({
  body: shared.registerPayloadSchema || z.any(), // Fallback ke z.any() agar server tidak crash
});

const loginSchema = z.object({
  body: shared.loginPayloadSchema || z.any(),
});

// 3. Export untuk digunakan di auth.routes.js
module.exports = { registerSchema, loginSchema };
