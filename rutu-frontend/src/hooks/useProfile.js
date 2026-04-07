import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useProfile = () => {
  const { user: localUser } = useAuth();

  // SERVER STATE: Mengambil data profil dari backend
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["profile", localUser?.id],
    queryFn: async () => {
      return await api.get(`/users/${localUser.id}`);
    },
    enabled: !!localUser?.id,
  });

  // HELPER: Memformat tanggal bergabung
  const formatDate = (dateString) => {
    if (!dateString) return "Belum diatur";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // HELPER: Membuat inisial jika tidak ada foto profil
  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  return {
    userProfile,
    isLoading,
    initials,
    formatDate,
  };
};
