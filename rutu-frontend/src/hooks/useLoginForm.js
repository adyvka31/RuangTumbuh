import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { loginPayloadSchema } from "@rutu/shared";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [apiError, setApiError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginPayloadSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      // Axios interceptor kita (di api.js) sudah otomatis me-return 'response.data.data'
      return await api.post("/auth/login", credentials);
    },
    onSuccess: (result) => {
      const data = result?.data || result;

      const user = data?.user;
      const token = data?.token;

      if (user && token) {
        login(user, token); // Simpan ke AuthContext & LocalStorage
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
          navigate("/dashboard");
        }, 3000);
      } else {
        setApiError("Gagal memproses data sesi dari server.");
      }
    },
    onError: (err) => {
      setApiError(err.response?.data?.message || "Email atau password salah!");
    },
  });

  const onSubmit = (data) => {
    setApiError("");
    loginMutation.mutate(data);
  };

  return {
    form,
    apiError,
    showPopup,
    loginMutation,
    onSubmit,
    navigate,
  };
};
