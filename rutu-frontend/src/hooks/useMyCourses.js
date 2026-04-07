import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useMyCourses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Kursus Saya");
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  // FETCH: Kursus yang dibuat sendiri
  const {
    data: myCreatedCourses = [],
    isLoading: loadingCourses,
    refetch: refetchCreatedCourses,
  } = useQuery({
    queryKey: ["createdCourses", user?.id],
    queryFn: async () => {
      const result = await api.get(`/courses?tutorId=${user.id}`);
      return Array.isArray(result.data) ? result.data : [];
    },
    enabled: !!user?.id,
  });

  // FETCH: Pengajuan kursus saya (sebagai siswa)
  const { data: myBookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["myBookings", user?.id],
    queryFn: async () => {
      const data = await api.get(`/bookings/student?studentId=${user.id}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user?.id,
  });

  // FETCH: Permintaan masuk (sebagai tutor)
  const { data: incomingBookings = [], isLoading: loadingIncoming } = useQuery({
    queryKey: ["incomingBookings", user?.id],
    queryFn: async () => {
      const data = await api.get(`/bookings/tutor?tutorId=${user.id}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user?.id,
  });

  // MUTATION: Update status booking
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
      queryClient.invalidateQueries(["incomingBookings", user?.id]);
    },
  });

  return {
    user,
    activeTab,
    setActiveTab,
    popup,
    setPopup,
    myCreatedCourses,
    myBookings,
    incomingBookings,
    loading: loadingCourses || loadingBookings || loadingIncoming,
    statusUpdateMutation,
    refetchCreatedCourses,
  };
};
