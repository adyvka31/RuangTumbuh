import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterForm.module.css";
import { FiUser, FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      );

      // 3. Jika sukses, munculkan popup
      setShowPopup(true);

      // 4. Beri jeda 2 detik (2000 ms), lalu pindah ke halaman login
      setTimeout(() => {
        setShowPopup(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Gagal register:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat registrasi",
      );
    }
  };

  return (
    <>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <div className={styles.inputFormGroup}>
          <Input
            type="text"
            id="name"
            name="name"
            label="Name"
            icon={FiUser}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            icon={FiAtSign}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className={styles.formRow}>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="password"
                name="password"
                label="Password"
                icon={FiLock}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.flexInput}>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm"
                icon={FiLock}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <Button type="submit">{isLoading ? "Loading..." : "Register"}</Button>
      </form>

      {showPopup && (
        <Popup
          isOpen={true} 
          icon={<MdCheckCircle />}
          title="Akun Dibuat!"
          description="Akun kamu berhasil dibuat, pergi ke login untuk melanjutkan pendaftaran."
          buttonText="Pergi Ke Login"
          onAction={() => navigate("/login")}
        />
      )}
    </>
  );
};
