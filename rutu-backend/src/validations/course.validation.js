// rutu-backend/src/validations/course.validation.js
const { z } = require("zod");
const { COURSE_CATEGORIES } = require("../utils/constants");

const createCourseSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(5, "Judul kursus minimal 5 karakter.")
      .max(100, "Judul kursus maksimal 100 karakter."),
    tutorId: z
      .string()
      .uuid("Format Tutor ID tidak valid.")
      .or(z.string())
      .optional(),

    // [PERBAIKAN] Validasi kategori ketat menggunakan .refine() milik Zod
    kategori: z
      .string()
      .min(1, "Kategori kursus wajib dipilih.")
      .refine((val) => COURSE_CATEGORIES.includes(val), {
        message: `Kategori harus salah satu dari kategori baku yang tersedia.`,
      }),

    durasi: z
      .union([z.string(), z.number()])
      .refine(
        (val) => parseInt(val) > 0,
        "Durasi kursus harus lebih dari 0 menit.",
      ),
    deskripsi: z
      .string()
      .min(20, "Deskripsi kursus minimal 20 karakter.")
      .max(1000, "Deskripsi kursus maksimal 1000 karakter."),
    modules: z
      .array(z.any())
      .min(1, "Kursus minimal harus memiliki 1 modul.")
      .max(20, "Maksimal 20 modul per kursus."),
  }),
});

const updateCourseSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(5, "Judul kursus minimal 5 karakter.")
      .max(100, "Judul kursus maksimal 100 karakter.")
      .optional(),

    // [PERBAIKAN] Sama seperti di atas namun .optional() untuk proses update
    kategori: z
      .string()
      .refine((val) => COURSE_CATEGORIES.includes(val), {
        message: `Kategori tidak valid.`,
      })
      .optional(),

    durasi: z
      .union([z.string(), z.number()])
      .refine(
        (val) => parseInt(val) > 0,
        "Durasi kursus harus lebih dari 0 menit.",
      )
      .optional(),
    deskripsi: z
      .string()
      .min(20, "Deskripsi kursus minimal 20 karakter.")
      .max(1000, "Deskripsi kursus maksimal 1000 karakter.")
      .optional(),
    modules: z
      .array(z.any())
      .max(20, "Maksimal 20 modul per kursus.")
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID Kursus harus berupa angka."),
  }),
});

const getCourseQuerySchema = z.object({
  query: z.object({
    tutorId: z.string().optional(),
    page: z.string().regex(/^\d+$/, "Page harus berupa angka.").optional(),
    limit: z.string().regex(/^\d+$/, "Limit harus berupa angka.").optional(),
    search: z.string().optional(),
    category: z.string().optional(),
  }),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  getCourseQuerySchema,
};
