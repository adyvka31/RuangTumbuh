import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useMyCourses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Kursus Saya");
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  // Helper agar tahan banting terhadap format response backend/axios
  const extractData = (res) =>
    Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

  // 1. FETCH: Kursus yang dibuat sendiri
  const {
    data: rawCreatedCourses = [],
    isLoading: loadingCourses,
    refetch: refetchCreatedCourses,
  } = useQuery({
    queryKey: ["createdCourses", user?.id],
    queryFn: async () =>
      extractData(await api.get(`/courses?tutorId=${user.id}`)),
    enabled: !!user?.id,
  });

  // 2. FETCH: Pengajuan kursus saya (sebagai siswa)
  const { data: rawMyBookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["myBookings", user?.id],
    queryFn: async () =>
      extractData(await api.get(`/bookings/student?studentId=${user.id}`)),
    enabled: !!user?.id,
  });

  // 3. FETCH: Permintaan masuk (sebagai tutor)
  const { data: rawIncomingBookings = [], isLoading: loadingIncoming } =
    useQuery({
      queryKey: ["incomingBookings", user?.id],
      queryFn: async () =>
        extractData(await api.get(`/bookings/tutor?tutorId=${user.id}`)),
      enabled: !!user?.id,
    });

  // --- TRANSORMASI DATA ---
  const myCreatedCourses = rawCreatedCourses.map((item) => ({
    id: item.id,
    title: item.name,
    author: item.tutor,
    category: item.kategori,
    duration: item.durasi,
    description: item.deskripsi,
  }));

  const formattedMyBookings = rawMyBookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    scheduledAt: booking.scheduledAt,
    tutorId: booking.tutorId || booking.course?.tutorId,
    token: booking.token,
    rating: booking.rating,
    review: booking.review,
    course: {
      name: booking.course?.name || "Kursus Tidak Diketahui",
      kategori: booking.course?.kategori || "General",
      tutor: booking.course?.tutor || "Tutor Tidak Diketahui",
    },
    role: "Sebagai Siswa",
    partnerName: booking.course?.tutor || "Tutor",
  }));

  const formattedIncomingBookings = rawIncomingBookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    scheduledAt: booking.scheduledAt,
    studentId: booking.studentId || booking.student?.id,
    rating: booking.rating,
    review: booking.review,
    studentName:
      booking.student?.name || booking.studentName || "Siswa Tidak Diketahui",
    note: booking.note || "",
    course: {
      name: booking.course?.name || "Kursus Tidak Diketahui",
      kategori: booking.course?.kategori || "General",
      durasi: booking.course?.durasi || 0,
    },
    role: "Sebagai Tutor",
    partnerName: booking.student?.name || booking.studentName || "Siswa",
  }));

  // --- DISTRIBUSI KE MASING-MASING TAB ---
  // Tampilkan yang belum selesai di tab Pengajuan/Permintaan
  const myBookings = formattedMyBookings.filter(
    (b) => b.status !== "COMPLETED",
  );
  const incomingBookings = formattedIncomingBookings.filter(
    (b) => b.status !== "COMPLETED",
  );

  // Gabungkan semua yang sudah selesai ke tab Selesai
  const completedBookings = [
    ...formattedMyBookings.filter((b) => b.status === "COMPLETED"),
    ...formattedIncomingBookings.filter((b) => b.status === "COMPLETED"),
  ].sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)); // Urutkan terbaru

  // 4. MUTATION: Update status booking
  const statusUpdateMutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }) => {
      return await api.patch(`/bookings/${bookingId}/status`, {
        status: newStatus,
        tutorId: user.id,
      });
    },
    onSuccess: (result) => {
      setPopup({
        isOpen: true,
        type: result.success !== false ? "success" : "danger",
        title: result.success !== false ? "Berhasil" : "Gagal",
        description: result.message || "Status berhasil diperbarui.",
      });
      // Refresh kedua daftar
      queryClient.invalidateQueries({
        queryKey: ["incomingBookings", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["myBookings", user?.id] });
    },
    onError: (error) => {
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Gagal",
        description:
          error.response?.data?.message || "Terjadi kesalahan koneksi.",
      });
    },
  });

  const handleStatusUpdate = (bookingId, newStatus) => {
    statusUpdateMutation.mutate({ bookingId, newStatus });
  };

  const handleChatUser = async (studentId) => {
    try {
      // Kita panggil endpoint getOrCreatePrivateRoom yang ada di backend
      const response = await api.post("/chats/private", {
        otherUserId: studentId,
      });

      // Sesuaikan dengan interceptor Axios Anda
      const roomData = response.data !== undefined ? response.data : response;

      if (roomData && roomData.id) {
        // Setelah dapat Room ID-nya, baru kita pindah halaman
        navigate(`/messages/${roomData.id}`);
      }
    } catch (error) {
      console.error("Gagal membuka obrolan:", error);
      setPopup({
        isOpen: true,
        type: "error",
        title: "Gagal Membuka Chat",
        description: "Terjadi kesalahan saat menghubungkan ke server chat.",
      });
    }
  };

  const completeBookingMutation = useMutation({
    mutationFn: async ({ bookingId, token }) => {
      // Panggil endpoint baru yang kita buat di backend
      const response = await api.post(`/bookings/${bookingId}/complete`, {
        tutorId: user.id,
        token: token,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["completedBookings"] });
      setPopup({
        isOpen: true,
        type: "success",
        title: "Kelas Selesai!",
        description: "Token valid. Sesi telah berhasil diselesaikan.",
      });
    },
    onError: (error) => {
      setPopup({
        isOpen: true,
        type: "error",
        title: "Gagal Menyelesaikan",
        description:
          error.response?.data?.message ||
          "Token tidak valid atau terjadi kesalahan.",
      });
    },
  });

  const handleCompleteSession = (bookingId, token) => {
    completeBookingMutation.mutate({ bookingId, token });
  };

  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ bookingId, rating, review }) => {
      const response = await api.post(`/bookings/${bookingId}/feedback`, {
        rating,
        review,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings", user?.id] });
      queryClient.invalidateQueries({
        queryKey: ["incomingBookings", user?.id],
      });

      setPopup({
        isOpen: true,
        type: "success",
        title: "Feedback Terkirim!",
        description: "Terima kasih atas ulasan yang Anda berikan.",
      });
    },
    onError: (error) => {
      setPopup({
        isOpen: true,
        type: "error",
        title: "Gagal",
        description:
          error.response?.data?.message || "Gagal mengirim feedback.",
      });
    },
  });

  const handleSubmitFeedback = (bookingId, rating, review) => {
    submitFeedbackMutation.mutate({ bookingId, rating, review });
  };

  return {
    user,
    activeTab,
    setActiveTab,
    popup,
    setPopup,
    myCreatedCourses,
    myBookings,
    incomingBookings,
    completedBookings,
    loading: loadingCourses || loadingBookings || loadingIncoming,
    statusUpdateMutation,
    refetchCreatedCourses,
    handleStatusUpdate,
    handleChatUser,
    handleCompleteSession,
    handleSubmitFeedback,
    submitFeedbackMutation,
  };
};
