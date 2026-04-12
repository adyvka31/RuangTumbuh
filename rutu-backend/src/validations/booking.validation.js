const { z } = require("zod");

const createBookingSchema = z.object({
  body: z.object({
    courseId: z.union([z.string(), z.number()]),
    studentId: z.string().min(1, "Student ID wajib diisi."),
    studentName: z.string().min(1, "Nama siswa wajib diisi."),
    scheduledAt: z.string().datetime({
      message: "Format waktu jadwal tidak valid (harus ISO-8601).",
    }),
    note: z.string().optional(),
  }),
});

const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ACCEPTED", "REJECTED", "CANCELLED"], {
      errorMap: () => ({
        message: "Status hanya boleh ACCEPTED, REJECTED, atau CANCELLED.",
      }),
    }),
    tutorId: z.string().optional(),
    userId: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "ID Booking tidak valid."),
  }),
});

module.exports = { createBookingSchema, updateBookingStatusSchema };
