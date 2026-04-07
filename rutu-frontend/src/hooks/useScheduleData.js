import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

export const useScheduleData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State Kalender Dinamis
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date().getDate().toString());
  const [activeCategory, setActiveCategory] = useState("Semua");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fungsi Pindah Bulan
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setActiveDate("1");
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setActiveDate("1");
  };

  // SERVER STATE: Fetch Data Jadwal
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["schedules", user?.id],
    queryFn: async () => {
      const data = await api.get(`/schedules/${user.id}`);
      return data.filter(
        (s) => s.status !== "Menunggu Konfirmasi" && s.status !== "Pending",
      );
    },
    enabled: !!user?.id,
  });

  // SERVER STATE: Mutation untuk Hapus/Selesai
  const deleteScheduleMutation = useMutation({
    mutationFn: async (itemId) => {
      return await api.delete(`/schedules/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules", user?.id]);
    },
    onError: (error) => {
      console.error("Error delete schedule:", error);
      alert("Gagal menyelesaikan jadwal.");
    },
  });

  // Filter jadwal bulan ini (untuk UI Kalender)
  const schedulesThisMonth = schedules.filter((s) => {
    if (!s.date) return false;
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const datesWithSchedules = schedulesThisMonth.map((s) =>
    new Date(s.date).getDate().toString(),
  );

  // Filter jadwal untuk Agenda di kanan
  const currentSchedules = schedulesThisMonth.filter((s) => {
    const d = new Date(s.date);
    const matchDate = d.getDate().toString() === activeDate;
    const matchCat =
      activeCategory === "Semua" || s.category === activeCategory;
    return matchDate && matchCat;
  });

  // Logika Generator Kalender
  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) =>
    (i + 1).toString(),
  );
  const emptyDaysStart = Array.from(
    { length: firstDayOfMonth },
    (_, i) => `empty-${i}`,
  );

  // Tindakan Pengguna
  const handleReschedule = (item) => {
    navigate("/add-schedule", { state: { editData: item } });
  };

  const handleDelete = (itemId) => {
    if (window.confirm("Apakah Anda yakin ingin menyelesaikan jadwal ini?")) {
      deleteScheduleMutation.mutate(itemId);
    }
  };

  return {
    year,
    month,
    activeDate,
    setActiveDate,
    activeCategory,
    setActiveCategory,
    currentSchedules,
    datesWithSchedules,
    daysInMonth,
    emptyDaysStart,
    isLoading,
    isDeleting: deleteScheduleMutation.isPending,
    deletingId: deleteScheduleMutation.variables,
    handlePrevMonth,
    handleNextMonth,
    handleReschedule,
    handleDelete,
    navigate,
  };
};
