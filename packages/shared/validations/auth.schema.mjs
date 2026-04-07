import { z } from "zod";

// Skema untuk Login
export const loginPayloadSchema = z.object({
  email: z.string().email("Format email tidak valid. Pastikan menggunakan @"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

// Skema untuk Register (Termasuk validasi confirm password)
export const registerPayloadSchema = z
  .object({
    name: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, "Nama hanya boleh berisi huruf.")
      .refine((val) => {
        const words = val.trim().split(/\s+/);
        return words.length >= 2 && words.length <= 5;
      }, "Nama lengkap harus terdiri dari 2 hingga 5 kata."),
    email: z.string().email("Format email tidak valid. Pastikan menggunakan @"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(32, "Password maksimal 32 karakter.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password wajib mengandung huruf besar, kecil, dan angka.",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password harus sama persis.",
    path: ["confirmPassword"],
  });
