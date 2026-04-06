const { z } = require("zod");
// Sesuaikan path ini dengan lokasi folder shared Anda
const {
  registerPayloadSchema,
  loginPayloadSchema,
} = require("../../../packages/shared/validations/auth.schema");

const registerSchema = z.object({
  body: registerPayloadSchema,
});

const loginSchema = z.object({
  body: loginPayloadSchema,
});

module.exports = { registerSchema, loginSchema };
