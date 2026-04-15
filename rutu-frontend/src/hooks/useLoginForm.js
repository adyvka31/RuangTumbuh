import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/utils/api";
import { loginPayloadSchema } from "@rutu/shared";

export const useLoginForm = () => {
  const navigate = useNavigate();{}
  const location = useLocation();
  const { login } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const [apiError, setApiError] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("expired") === "true"
      ? "Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan login kembali."
      : "";
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("expired") === "true") {
      window.history.replaceState(null, "", "/login");
    }
  }, [location.search]);

  const form = useForm({
    resolver: zodResolver(loginPayloadSchema),
    mode: "onBlur",
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      return await api.post("/auth/login", credentials);
    },
    onSuccess: (result) => {
      const data = result?.data || result;
      const user = data?.user;
      const token = data?.token;

      if (user && token) {
        login(user, token);
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
