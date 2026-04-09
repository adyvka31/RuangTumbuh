import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useDashboard = () => {
  const { user } = useAuth();

  // Nama sapaan (firstName) dengan fallback yang lebih aman
  const userName = user?.name || "Pengguna";
  const firstName = userName.split(" ")[0];

  // SERVER STATE: Fetch data statistik dashboard
  const {
    data: dbStats = {
      timeBalance: 0,
      learningMinutes: 0,
      upcomingSessions: 0,
      completedSessions: 0,
      mentoringSessions: [],
    },
    isPending,
    isError,
  } = useQuery({
    queryKey: ["dashboard", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return null;

      const data = (await api.get(`/users/${user.id}/dashboard`)) ?? {};

      return {
        timeBalance: data?.timeBalance || 0,
        learningMinutes: data?.learningMinutes || 0,
        upcomingSessions: data?.upcomingSessions || 0,
        completedSessions: data?.completedSessions || 0,
        mentoringSessions: data?.mentoringSessions || [],
      };
    },
  });

  // HELPER: Format waktu jadwal ke WIB menggunakan native JavaScript (Tanpa date-fns)
  const formatScheduleTime = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Standarisasi format jam menggunakan titik dua (misal: 10:00 bukan 10.00)
      return `${formattedDate.replace(/\./g, ":")} WIB`;
    } catch (error) {
      console.error("Format date error:", error);
      return "-";
    }
  };

  // KONSTANTA: Tema warna untuk list mentoring
  const colorThemes = [
    { bg: "var(--primary-yellow)", badge: "#fff" },
    { bg: "var(--primary-blue)", badge: "#fff" },
    { bg: "var(--primary-green)", badge: "#fff" },
  ];

  return {
    firstName,
    dbStats,
    isPending,
    isError,
    formatScheduleTime,
    colorThemes,
  };
};
