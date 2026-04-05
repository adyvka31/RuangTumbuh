const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, "Nama lengkap harus berisi huruf saja.")
      .refine((val) => {
        const words = val.trim().split(/\s+/);
        return words.length >= 2 && words.length <= 5;
      }, "Nama harus terdiri dari 2 hingga 5 kata.")
      .optional(),
    birthday: z
      .string()
      .refine((dateString) => {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      }, "Tanggal lahir tidak boleh di masa depan.")
      .optional(),
    description: z
      .string()
      .max(500, "Deskripsi maksimal 500 karakter.")
      .optional(),
    location: z.string().max(100, "Lokasi maksimal 100 karakter.").optional(),
    school: z
      .string()
      .max(100, "Nama institusi maksimal 100 karakter.")
      .optional(),
  }),
  // Parameter ID di URL juga bisa kita validasi
  params: z.object({
    id: z.string().uuid("Format User ID tidak valid").optional().or(z.string()),
  }),
});

module.exports = { updateProfileSchema };
