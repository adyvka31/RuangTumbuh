import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/utils/api";
import styles from "./RegisterForm.module.css";
import { FiUser, FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";

import { registerPayloadSchema } from "@rutu/shared";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerPayloadSchema),
  });

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

  // Dipanggil otomatis setelah Zod menyatakan form valid 100%
  const onSubmit = (data) => {
    setApiError("");
    registerMutation.mutate(data);
  };

  return (
    <>
      <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
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
              type="text"
              id="name"
              label="Name"
              icon={FiUser}
              {...register("name")}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.name.message}
              </span>
            )}
          </div>

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

          <div className={styles.formRow}>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="password"
                label="Password"
                icon={FiLock}
                {...register("password")}
              />
              {errors.password && (
                <span
                  style={{
                    color: "red",
                    fontSize: "0.8rem",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="confirmPassword"
                label="Confirm"
                icon={FiLock}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span
                  style={{
                    color: "red",
                    fontSize: "0.8rem",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Loading..." : "Register"}
        </Button>
      </form>

      <Popup
        isOpen={popup.isOpen}
        type="success"
        icon={<MdCheckCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="Pergi Ke Login"
        onAction={() => navigate("/login")}
      />
    </>
  );
};
