import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/utils/api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";

import { loginPayloadSchema } from "@rutu/shared";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [apiError, setApiError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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

  // onSubmit hanya akan dipanggil jika validasi Zod SUKSES
  const onSubmit = (data) => {
    setApiError("");
    loginMutation.mutate(data);
  };

  return (
    <>
      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        {apiError && (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              marginBottom: "10px",
              marginTop: "-15px",
            }}
          >
            {apiError}
          </p>
        )}

        <div className={styles.inputFormGroup}>
          <div>
            <Input
              type="email"
              id="email"
              label="Email"
              icon={FiAtSign}
              {...register("email")}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <Input
              type="password"
              id="password"
              label="Password"
              icon={FiLock}
              {...register("password")}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.passwordActionsForm}>
            <div className={styles.rememberMeGroup}>
              <input type="checkbox" name="Rememberme" id="rememberme" />
              <label htmlFor="rememberme">Ingatkan Saya</label>
            </div>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Lupa Password
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Loading..." : "Login"}
        </Button>
      </form>

      {showPopup && (
        <Popup
          isOpen={true}
          icon={<MdCheckCircle />}
          title="Login Berhasil!"
          description="Selamat datang kembali! Sedang mengalihkan ke Dashboard..."
          buttonText="Pergi Ke Dashboard"
          onAction={() => navigate("/dashboard")}
        />
      )}
    </>
  );
};
