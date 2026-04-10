import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/utils/api";

export const useAddCourse = () => {
  const navigate = useNavigate();
  // 1. DETEKSI MODE EDIT DARI URL
  const { id } = useParams();
  const isEditMode = !!id; // Jika id ada, maka bernilai true

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    tutorId: "",
  });

  const [modules, setModules] = useState([
    { id: Date.now(), title: "", duration: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  const [isPending, setIsPending] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Loading state saat ambil data edit
  const mutation = { isPending };

  // Set Tutor ID
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setFormData((prev) => ({ ...prev, tutorId: user.id }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // 2. FETCH DATA JIKA DALAM MODE EDIT
  useEffect(() => {
    if (isEditMode) {
      const fetchCourseDetail = async () => {
        setIsFetching(true);
        try {
          const response = await api.get(`/courses/${id}`);

          // --- PERBAIKAN UTAMA DI SINI ---
          // Jika interceptor Axios sudah mengekstrak data, maka response IS courseData.
          // Fallback ke response.data jika interceptor tidak mengekstraknya.
          const courseData =
            response.data !== undefined ? response.data : response;

          // Proteksi tambahan: Pastikan courseData valid sebelum dimasukkan ke form
          if (!courseData || !courseData.name) {
            throw new Error("Data kursus tidak valid atau kosong dari server");
          }

          // Isi form dengan data dari database (Gunakan Optional Chaining '?')
          setFormData((prev) => ({
            ...prev,
            title: courseData?.name || "",
            category: courseData?.kategori || "",
            duration: courseData?.durasi || "",
            description: courseData?.deskripsi || "",
          }));

          // Isi modul dengan data dari database
          if (courseData?.modules && courseData.modules.length > 0) {
            setModules(
              courseData.modules.map((m) => ({
                id: m.id || Math.random().toString(),
                title: m.title || "",
                duration: m.duration || "",
              })),
            );
          }
        } catch (error) {
          console.error("Gagal mengambil detail kursus:", error);
          setPopup({
            isOpen: true,
            type: "error",
            title: "Gagal Memuat Data",
            description:
              "Data kursus tidak ditemukan atau terjadi kesalahan server.",
          });
        } finally {
          setIsFetching(false);
        }
      };

      fetchCourseDetail();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const addModule = () =>
    setModules((prev) => [
      ...prev,
      { id: Date.now(), title: "", duration: "" },
    ]);

  const removeModule = (id) => {
    if (modules.length === 1) {
      setErrors((prev) => ({
        ...prev,
        modules: "Kursus harus memiliki minimal 1 modul!",
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, modules: null })), 3000);
      return;
    }
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const updateModule = (moduleId, field, value) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, [field]: value } : m)),
    );
  };

  const handleGoBack = () => navigate("/mycourses");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Judul kursus wajib diisi";
    if (!formData.category) newErrors.category = "Kategori wajib dipilih";
    if (!formData.duration) newErrors.duration = "Durasi wajib diisi";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi wajib diisi";

    const isModulesValid = modules.every(
      (m) => m.title.trim() !== "" && m.duration !== "",
    );
    if (!isModulesValid)
      newErrors.modules = "Pastikan semua judul dan durasi modul sudah terisi!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsPending(true);

    try {
      const payload = {
        name: formData.title,
        kategori: formData.category,
        durasi: parseInt(formData.duration),
        deskripsi: formData.description,
        tutorId: formData.tutorId,
        modules: modules.map(({ title, duration }) => ({
          title,
          duration: parseInt(duration),
        })),
      };

      // 3. PISAHKAN LOGIKA REQUEST: POST (Tambah) vs PATCH/PUT (Edit)
      if (isEditMode) {
        // Asumsi backend Anda menggunakan method PUT atau PATCH untuk update
        await api.patch(`/courses/${id}`, payload);
        setPopup({
          isOpen: true,
          type: "success",
          title: "Berhasil Diperbarui!",
          description: "Perubahan kursus Anda telah disimpan.",
        });
      } else {
        await api.post("/courses", payload);
        setPopup({
          isOpen: true,
          type: "success",
          title: "Berhasil!",
          description: "Kursus baru berhasil ditambahkan.",
        });
        setFormData({
          title: "",
          category: "",
          duration: "",
          description: "",
          tutorId: formData.tutorId,
        });
        setModules([{ id: Date.now(), title: "", duration: "" }]);
      }
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      setPopup({
        isOpen: true,
        type: "error",
        title: "Gagal Menyimpan",
        description:
          err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan kursus.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    formData,
    modules,
    errors,
    popup,
    mutation,
    isEditMode,
    isFetching, // Export variable baru
    setPopup,
    handleInputChange,
    addModule,
    removeModule,
    updateModule,
    handleSubmit,
    handleGoBack,
  };
};
