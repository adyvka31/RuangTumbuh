const { z } = require("zod");

// Helper schema untuk validasi data jadwal (dipakai berulang di create dan edit)
const scheduleDataSchema = z.object({
  title: z
    .string()
    .min(3, "Nama kegiatan minimal 3 karakter.")
    .max(50, "Nama kegiatan maksimal 50 karakter."),
  platform: z
    .string()
    .min(3, "Platform / Lokasi minimal 3 karakter.")
    .max(50, "Platform / Lokasi maksimal 50 karakter."),
  partner: z
    .string()
    .min(3, "Nama partisipan minimal 3 karakter.")
    .max(50, "Nama partisipan maksimal 50 karakter."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD."),
  time: z.string().min(1, "Waktu tidak boleh kosong."),
  durationMinutes: z.union([z.string(), z.number()]).optional(),
  category: z.string().optional(),
});

const addScheduleSchema = z.object({
  body: scheduleDataSchema.extend({
    studentId: z.string().min(1, "Student ID wajib diisi."),
  }),
});

const editScheduleSchema = z.object({
  body: scheduleDataSchema,
  params: z.object({
    id: z
      .string()
      .regex(/^(booking|course)-.+$/, "Format ID Jadwal tidak valid."),
  }),
});

module.exports = { addScheduleSchema, editScheduleSchema };
