import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./AddCoursePage.module.css";
import { Popup } from "@/components/Popup/Popup";

// --- Import Komponen & Style Input dari halaman Auth ---
import { Input } from "@/components/Input/Input";
import inputStyles from "@/components/Input/Input.module.css";

import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiClock,
  FiBookOpen,
  FiList,
  FiVideo,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function AddCoursePage() {
  const navigate = useNavigate();

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

  // State untuk UX & Notifikasi
  const [error, setError] = useState(""); // <-- Kotak Error Merah
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user as tutor
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setFormData((prev) => ({ ...prev, tutorId: user.id }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    if (error) setError(""); // Hapus error saat mengetik ulang
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addModule = () => {
    if (modules.length >= 20) {
      setError(
        "Batas maksimal tercapai! Anda hanya dapat menambahkan 20 modul.",
      );
      return;
    }
    setModules([...modules, { id: Date.now(), title: "", duration: "" }]);
  };

  const removeModule = (id) => {
    if (modules.length > 1) {
      setModules(modules.filter((m) => m.id !== id));
    }
  };

  const updateModule = (id, field, value) => {
    if (error) setError(""); // Hapus error saat memodifikasi modul
    setModules(
      modules.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error setiap submit

    // ==========================================
    // 🛡️ FRONTEND FORM VALIDATION
    // ==========================================
    const { title, category, duration, description } = formData;

    if (!title || title.length < 5 || title.length > 100) {
      setError("Judul kursus harus diisi antara 5 hingga 100 karakter.");
      return;
    }
    if (!category) {
      setError("Kategori kursus wajib dipilih.");
      return;
    }
    if (!duration || isNaN(duration) || parseInt(duration) <= 0) {
      setError(
        "Durasi kursus wajib diisi dengan angka positif (lebih dari 0).",
      );
      return;
    }
    if (!description || description.length < 20 || description.length > 1000) {
      setError(
        "Deskripsi kursus harus jelas dan informatif (antara 20 - 1000 karakter).",
      );
      return;
    }

    // Validasi Modul
    if (modules.length === 0) {
      setError("Anda harus menambahkan minimal 1 modul materi.");
      return;
    }

    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      if (!m.title || m.title.trim() === "") {
        setError(`Judul materi pada modul ke-${i + 1} tidak boleh kosong.`);
        return;
      }
      if (!m.duration || isNaN(m.duration) || parseInt(m.duration) <= 0) {
        setError(
          `Durasi materi pada modul ke-${i + 1} harus valid (lebih dari 0).`,
        );
        return;
      }
    }
    // ==========================================

    setIsSubmitting(true);
    try {
      const courseData = {
        name: title,
        tutorId: formData.tutorId,
        kategori: category,
        durasi: duration,
        deskripsi: description,
        modules: modules.map((m) => ({ title: m.title, duration: m.duration })),
      };

      const response = await fetch("http://localhost:5001/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        setPopup({
          isOpen: true,
          type: "success",
          title: "Kursus Diterbitkan! 🚀",
          description:
            "Kursus baru Anda berhasil ditambahkan ke Pusat Course! Mengalihkan ke dashboard...",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // Tampilkan pesan error dari backend
        setError(
          result.message || "Terjadi kesalahan saat menambahkan kursus.",
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Tambah Kursus Baru">
      <form onSubmit={handleSubmit} className={styles.container}>

        <div className={styles.splitLayout}>
          {/* KOLOM KIRI: Informasi Utama */}
          <div className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#38BDF8" }}
              >
                <FiBookOpen />
              </div>
              <h3>Informasi Utama</h3>
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginBottom: "5px",
                  marginTop: "-15px",
                }}
              >
                {error}
              </p>
            )}

            <Input
              type="text"
              id="title"
              name="title"
              label="Judul Kursus"
              value={formData.title}
              onChange={handleInputChange}
            />

            <div className={styles.rowGroup}>
              <div
                className={inputStyles.inputContainer}
                style={{ marginBottom: 0 }}
              >
                <div className={inputStyles.inputWrapper}>
                  <select
                    id="category"
                    name="category"
                    className={inputStyles.inputForm}
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{ cursor: "pointer", appearance: "none" }}
                  >
                    <option value="" disabled hidden></option>
                    <option value="programming">Pemrograman</option>
                    <option value="design">UI/UX Design</option>
                    <option value="business">Bisnis & Marketing</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Fisika">Fisika</option>
                  </select>
                  <label
                    htmlFor="category"
                    className={inputStyles.floatingLabel}
                    style={{
                      top: 0,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: formData.category
                        ? "var(--primary-yellow)"
                        : "#b0b7c3",
                    }}
                  >
                    Kategori
                  </label>
                  <FiChevronDown className={inputStyles.inputIcon} />
                </div>
              </div>

              <div style={{ marginBottom: "-1rem" }}>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  label="Total Durasi (Menit)"
                  icon={FiClock}
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>

            <div className={inputStyles.inputContainer}>
              <div className={inputStyles.inputWrapper}>
                <textarea
                  id="description"
                  name="description"
                  placeholder=" "
                  className={inputStyles.inputForm}
                  style={{
                    resize: "vertical",
                    minHeight: "120px",
                    paddingTop: "1.5rem",
                  }}
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
                <label
                  htmlFor="description"
                  className={inputStyles.floatingLabel}
                >
                  Deskripsi Singkat Kursus
                </label>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Modul / Silabus */}
          <div className={styles.modulesCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#FACC15" }}
              >
                <FiList />
              </div>
              <h3>Daftar Modul</h3>
            </div>

            <p className={styles.moduleDesc}>
              Tambahkan silabus atau materi yang akan dipelajari dalam kursus
              ini secara berurutan.
            </p>

            <div className={styles.moduleList}>
              <AnimatePresence>
                {modules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    className={styles.moduleItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.moduleNumber}>{index + 1}</div>

                    <div className={styles.moduleInputs}>
                      <div style={{ marginBottom: "-1rem" }}>
                        <Input
                          type="text"
                          id={`title-${module.id}`}
                          name="title"
                          label="Judul Materi"
                          value={module.title}
                          onChange={(e) =>
                            updateModule(module.id, "title", e.target.value)
                          }
                        />
                      </div>
                      <div style={{ marginBottom: "-1rem" }}>
                        <Input
                          type="number"
                          id={`duration-${module.id}`}
                          name="duration"
                          label="Menit"
                          icon={FiVideo}
                          value={module.duration}
                          onChange={(e) =>
                            updateModule(module.id, "duration", e.target.value)
                          }
                          min="1"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.trashBtn}
                      onClick={() => removeModule(module.id)}
                      disabled={modules.length === 1}
                    >
                      <FiTrash2 />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              className={styles.addModuleBtn}
              onClick={addModule}
            >
              <FiPlus /> Tambah Modul Materi
            </button>
          </div>
        </div>

        {/* --- BOTTOM ACTION BAR --- */}
        <motion.div
          className={styles.actionBar}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.actionText}>
            <h3>Sudah selesai? 🚀</h3>
            <p>
              Pastikan semua data sudah terisi dengan benar sebelum menerbitkan
              kursus.
            </p>
          </div>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={isSubmitting}
          >
            <FiSave size={20} />{" "}
            {isSubmitting ? "Menyimpan..." : "Terbitkan Kursus"}
          </button>
        </motion.div>
      </form>

      {/* POPUP SUKSES */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={<FiCheckCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="Tutup"
        onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
