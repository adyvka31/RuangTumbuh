const { z } = require("zod");
const shared = require("@rutu/shared");

// Ambil skema langsung, ATAU dari dalam objek .default (jika ter-transpile)
const registerPayloadSchema =
  shared.registerPayloadSchema || shared.default?.registerPayloadSchema;
const loginPayloadSchema =
  shared.loginPayloadSchema || shared.default?.loginPayloadSchema;

// Cek apakah skema berhasil dimuat
if (!loginPayloadSchema) {
  console.error(
    "🚨 PERINGATAN: loginPayloadSchema gagal dimuat dari @rutu/shared. Isi module:",
    shared,
  );
}

const registerSchema = z.object({
  body: registerPayloadSchema || z.any(),
});

const loginSchema = z.object({
  body: loginPayloadSchema || z.any(),
});

module.exports = { registerSchema, loginSchema };
