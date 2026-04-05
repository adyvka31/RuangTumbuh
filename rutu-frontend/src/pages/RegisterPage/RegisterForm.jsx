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

  const [error, setError] = useState(""); // <-- State untuk teks merah di atas form
  const [isLoading, setIsLoading] = useState(false);

  // Popup sekarang hanya digunakan khusus untuk SUKSES
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    // Menghapus pesan error ketika user mulai mengetik ulang
    if (error) setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error setiap kali tombol submit ditekan

    const { name, email, password, confirmPassword } = formData;

    // ==========================================
    // 🛡️ VALIDASI FRONTEND (Tampil sebagai Teks Merah)
    // ==========================================

    // 1. Validasi Password Match
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password harus sama persis.");
      return;
    }

    // 2. Validasi Nama
    const nameRegex = /^[a-zA-Z\s]*$/;
    const nameWords = name.trim().split(/\s+/);

    if (!nameRegex.test(name)) {
      setError("Nama hanya boleh berisi huruf.");
      return;
    }
    if (nameWords.length < 2 || nameWords.length > 5) {
      setError("Nama lengkap harus terdiri dari 2 hingga 5 kata.");
      return;
    }

    // 3. Validasi Kekuatan Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,32}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password harus 8-32 karakter dan mengandung kombinasi huruf besar, kecil, serta angka.",
      );
      return;
    }

    // ==========================================
    // 🚀 KIRIM KE BACKEND
    // ==========================================
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      );

      // Jika SUKSES, baru kita panggil Popup
      setPopup({
        isOpen: true,
        title: "Akun Dibuat!",
        description:
          "Akun kamu berhasil dibuat. Mengalihkan ke halaman login...",
      });

      setTimeout(() => {
        setPopup({ ...popup, isOpen: false });
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Gagal register:", err);
      // Jika GAGAL dari backend (misal: Email sudah dipakai), tampilkan error merah di atas input
      setError(
        err.response?.data?.message ||
          "Terjadi kesalahan saat registrasi. Coba lagi nanti.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        {/* TEMPAT MUNCULNYA TEKS ERROR MERAH */}
        {error && (
          <p style={{ color: "red", fontWeight: "bold", marginBottom: "10px", marginTop: "-15px" }}>
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>

      {/* POPUP HANYA UNTUK SUKSES */}
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
