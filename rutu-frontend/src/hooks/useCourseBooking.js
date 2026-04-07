// hooks/useCourseBooking.js
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

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => await api.get(`/courses/${id}`),
    enabled: !!id,
  });

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
        title: "Berhasil!",
        description:
          "Permintaan booking kamu berhasil diajukan! Silakan cek di menu My Courses.",
      });
      setTimeout(() => navigate("/mycourses"), 2500);
    },
    onError: (error) => {
      setPopup({
        isOpen: true,
        type: "danger",
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

  const handleBooking = () => {
    if (!formData.date || !formData.time) {
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Gagal",
        description: "Harap pilih tanggal dan waktu!",
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
