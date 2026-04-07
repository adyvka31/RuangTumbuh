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
      return await api.post("/auth/login", credentials);
    },
    onSuccess: (result) => {
      login(result.user, result.token);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/dashboard");
      }, 3000);
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
