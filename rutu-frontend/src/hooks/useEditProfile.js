import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";

export const useEditProfile = () => {
  const { user, updateUserData } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPassion, setNewPassion] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    birthday: "",
    school: "",
    description: "",
    passions: [],
    avatar: "",
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  // FETCH DATA PROFIL
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => await api.get(`/users/${user.id}`),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profileData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        location: profileData.location || "",
        birthday: profileData.birthday || "",
        school: profileData.school || "",
        description: profileData.description || "",
        passions: profileData.passions || [],
        avatar:
          profileData.profilePicture ||
          (profileData.name
            ? profileData.name.substring(0, 2).toUpperCase()
            : "US"),
      });
    }
  }, [profileData]);

  // MUTATION SIMPAN PROFIL
  const updateProfileMutation = useMutation({
    mutationFn: async (formDataToSend) =>
      await api.put(`/users/${user.id}`, formDataToSend),
    onSuccess: (result) => {
      updateUserData({
        name: formData.name,
        profilePicture: result.profilePicture || formData.avatar,
      });
      queryClient.invalidateQueries(["profile", user?.id]);
      setPopup({
        isOpen: true,
        type: "success",
        title: "Profil Diperbarui!",
        description: "Data diri Anda berhasil disimpan.",
      });
    },
    onError: () => setError("Terjadi kesalahan koneksi ke server backend."),
  });

  const handleInputChange = (e) => {
    if (error) setError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addPassion = () => {
    if (newPassion && !formData.passions.includes(newPassion)) {
      if (formData.passions.length >= 10)
        return setError("Maksimal 10 keahlian.");
      setFormData((prev) => ({
        ...prev,
        passions: [...prev.passions, newPassion],
      }));
      setNewPassion("");
    }
  };

  const removePassion = (pToRemove) => {
    setFormData((prev) => ({
      ...prev,
      passions: prev.passions.filter((p) => p !== pToRemove),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return setError("Maksimal 2MB.");
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Logika validasi (Nama, Birthday, dll) tetap dipertahankan di sini
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "passions")
        formDataToSend.append(key, JSON.stringify(formData[key]));
      else formDataToSend.append(key, formData[key]);
    });
    if (selectedFile) formDataToSend.append("profilePicture", selectedFile);
    updateProfileMutation.mutate(formDataToSend);
  };

  return {
    formData,
    setFormData,
    newPassion,
    setNewPassion,
    error,
    popup,
    setPopup,
    previewImage,
    fileInputRef,
    isLoading,
    isPending: updateProfileMutation.isPending,
    handleInputChange,
    addPassion,
    removePassion,
    handleFileChange,
    handleSave,
  };
};
