import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";

export const useEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
  });
  const [modules, setModules] = useState(() => [
    { id: Date.now(), title: "", duration: "" },
  ]);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  // FETCH DATA KURSUS LAMA
  const {
    data: courseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courseDetail", id],
    queryFn: async () => await api.get(`/courses/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (courseData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: courseData.name || "",
        category: courseData.kategori || "",
        duration: courseData.durasi || "",
        description: courseData.deskripsi || "",
      });
      if (courseData.modules?.length > 0) {
        setModules(
          courseData.modules.map((m, idx) => ({
            id: idx + Date.now(),
            title: m.title || "",
            duration: m.duration || "",
          })),
        );
      }
    }
  }, [courseData]);

  // MUTATION UPDATE KURSUS
  const updateCourseMutation = useMutation({
    mutationFn: async (payload) => await api.put(`/courses/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["createdCourses"]);
      queryClient.invalidateQueries(["courseDetail", id]);
      setPopup({
        isOpen: true,
        type: "success",
        title: "Berhasil! 🎉",
        description: "Data kursus telah diperbarui. Mengalihkan...",
      });
      setTimeout(() => navigate("/mycourses"), 2000);
    },
    onError: (error) =>
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Gagal",
        description:
          error.response?.data?.message || "Terjadi kesalahan koneksi.",
      }),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateModule = (moduleId, field, value) => {
    setModules(
      modules.map((m) => (m.id === moduleId ? { ...m, [field]: value } : m)),
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.title,
      kategori: formData.category,
      durasi: formData.duration,
      deskripsi: formData.description,
      modules: modules.map((m) => ({ title: m.title, duration: m.duration })),
    };
    updateCourseMutation.mutate(payload);
  };

  return {
    formData,
    modules,
    setModules,
    popup,
    setPopup,
    isLoading,
    isError,
    isPending: updateCourseMutation.isPending,
    handleInputChange,
    updateModule,
    handleSave,
    navigate,
  };
};
