import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useAddSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const editData = location.state?.editData;
  const isEdit = !!editData;

  const [error, setError] = useState("");
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    durationMinutes: "60",
    category: "Mentoring",
    platform: "Google Meet",
    partner: "",
  });

  // Sinkronisasi data jika dalam mode EDIT
  useEffect(() => {
    if (isEdit && editData) {
      const d = new Date(editData.date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: editData.title.replace("Mentoring: ", "").replace("Kelas: ", ""),
        date: `${yyyy}-${mm}-${dd}`,
        time: editData.time.replace(".", ":"),
        durationMinutes: "60",
        category: editData.category,
        platform: editData.platform,
        partner: editData.partner,
      });
    }
  }, [isEdit, editData]);

  const saveScheduleMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) return await api.put(`/schedules/${editData.id}`, payload);
      return await api.post("/schedules", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["schedules", user?.id]);
      setPopup({
        isOpen: true,
        type: "success",
        title: isEdit ? "Jadwal Diperbarui! 🔄" : "Jadwal Berhasil Dibuat! 📅",
        description: isEdit
          ? "Data kalender Anda berhasil di-reschedule."
          : "Jadwal baru telah ditambahkan.",
      });
      setTimeout(() => navigate("/schedule"), 2000);
    },
    onError: () =>
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda."),
  });

  const handleChange = (e) => {
    if (error) setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validasi sederhana (bisa dikembangkan sesuai kebutuhan)
    if (!formData.title || !formData.date || !formData.time) {
      return setError("Harap lengkapi informasi waktu dan kegiatan.");
    }

    saveScheduleMutation.mutate({ studentId: user.id, ...formData });
  };

  return {
    formData,
    isEdit,
    error,
    popup,
    setPopup,
    isPending: saveScheduleMutation.isPending,
    handleChange,
    handleSubmit,
    navigate,
  };
};
