import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useDashboard = () => {
  const { user } = useAuth();

  // Nama sapaan (firstName)
  const userName = user ? user.name : "Pengguna";
  const firstName = userName.split(" ")[0];

  // SERVER STATE: Fetch data statistik dashboard
  const {
    data: dbStats,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: async () => {
      const data = await api.get(`/users/${user.id}/dashboard`);
      return {
        timeBalance: data?.timeBalance || 0,
        learningMinutes: data?.learningMinutes || 0,
        upcomingSessions: data?.upcomingSessions || 0,
        completedSessions: data?.completedSessions || 0,
        mentoringSessions: data?.mentoringSessions || [],
      };
    },
    enabled: !!user?.id,
  });

  // HELPER: Format waktu jadwal ke WIB
  const formatScheduleTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  // KONSTANTA: Tema warna untuk list mentoring
  const colorThemes = [
    { bg: "var(--primary-yellow)", badge: "#fde68a" },
    { bg: "var(--primary-blue)", badge: "#bfdbfe" },
    { bg: "var(--primary-green)", badge: "#86efac" },
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
