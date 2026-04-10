import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";

export const useCourseBooking = (id, currentUser) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    note: "",
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  // Fetch data kursus dengan perbaikan interceptor Axios
  const {
    data: rawCourse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data !== undefined ? response.data : response;
    },
    enabled: !!id,
  });

  const course = rawCourse;

  const bookingMutation = useMutation({
    mutationFn: async (scheduledAt) => {
      return await api.post("/bookings", {
        courseId: parseInt(id),
        studentId: currentUser.id,
        studentName: currentUser.name,
        scheduledAt,
        note: formData.note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myBookings", currentUser?.id]);
      setPopup({
        isOpen: true,
        type: "success",
        title: "Booking Berhasil!",
        description:
          "Permintaan booking kamu berhasil diajukan! Silakan cek di menu My Courses.",
      });
      // Tunggu user membaca popup sejenak sebelum diarahkan
      setTimeout(() => navigate("/mycourses"), 2500);
    },
    onError: (error) => {
      setPopup({
        isOpen: true,
        type: "error", // Sesuaikan dengan tipe popup ("error" bukan "danger")
        title: "Booking Gagal",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memproses booking.",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = (e) => {
    e.preventDefault(); // Mencegah reload halaman jika dipanggil dari tag <form>

    if (!formData.date || !formData.time) {
      setPopup({
        isOpen: true,
        type: "error",
        title: "Data Tidak Lengkap",
        description: "Harap pilih tanggal dan waktu sesi kursus kamu!",
      });
      return;
    }

    const scheduledAt = new Date(
      `${formData.date}T${formData.time}`,
    ).toISOString();
    bookingMutation.mutate(scheduledAt);
  };

  return {
    course,
    isLoading,
    isError,
    formData,
    popup,
    bookingMutation,
    setPopup,
    handleInputChange,
    handleBooking,
  };
};
