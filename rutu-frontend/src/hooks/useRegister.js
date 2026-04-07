import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/utils/api";
import { registerPayloadSchema } from "@rutu/shared";

export const useRegister = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  // Integrasi React Hook Form dengan Zod Schema dari shared package
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerPayloadSchema),
  });

  // Logika Mutasi API
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      return await api.post("/auth/register", userData);
    },
    onSuccess: () => {
      setPopup({
        isOpen: true,
        title: "Akun Dibuat!",
        description:
          "Akun kamu berhasil dibuat. Mengalihkan ke halaman login...",
      });
      setTimeout(() => {
        setPopup((p) => ({ ...p, isOpen: false }));
        navigate("/login");
      }, 3000);
    },
    onError: (err) => {
      setApiError(
        err.response?.data?.message ||
          "Terjadi kesalahan saat registrasi. Coba lagi nanti.",
      );
    },
  });

  const onSubmit = (data) => {
    setApiError("");
    registerMutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    apiError,
    popup,
    isPending: registerMutation.isPending,
    navigate,
  };
};
