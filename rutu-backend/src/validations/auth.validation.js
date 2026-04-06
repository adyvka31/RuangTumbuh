const { z } = require("zod");
const { registerPayloadSchema, loginPayloadSchema } = require("@rutu/shared");

const registerSchema = z.object({
  body: registerPayloadSchema,
});

const loginSchema = z.object({
  body: loginPayloadSchema,
});

module.exports = { registerSchema, loginSchema };
