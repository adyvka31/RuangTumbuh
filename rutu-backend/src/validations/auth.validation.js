const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    name: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, "Nama lengkap harus berisi huruf saja.")
      .refine((val) => {
        const words = val.trim().split(/\s+/);
        return words.length >= 2 && words.length <= 5;
      }, "Nama harus terdiri dari 2 hingga 5 kata."),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(32, "Password maksimal 32 karakter.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password wajib mengandung huruf besar, kecil, dan angka.",
      ),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password tidak boleh kosong"),
  }),
});

module.exports = { registerSchema, loginSchema };
