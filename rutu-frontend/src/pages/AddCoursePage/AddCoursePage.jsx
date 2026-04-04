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
    duration: "", // Diubah dari price ke duration agar sesuai input
    description: "",
    tutorId: "", // Otomatis dari ID user yang login
  });

  const [popup, setPopup] = useState({ isOpen: false, type: "success", title: "", description: "" });

  // Get current user as tutor
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setFormData((prev) => ({ ...prev, tutorId: user.id }));
    }
  }, []);


  const [modules, setModules] = useState([
    { id: Date.now(), title: "", duration: "" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addModule = () => {
    setModules([...modules, { id: Date.now(), title: "", duration: "" }]);
  };

  const removeModule = (id) => {
    if (modules.length > 1) {
      setModules(modules.filter((m) => m.id !== id));
    }
  };

  const updateModule = (id, field, value) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Simple Form Validation ---
    if (
      !formData.title ||
      !formData.category ||
      !formData.duration ||
      !formData.description
    ) {
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Form Tidak Lengkap",
        description: "Harap isi semua field informasi utama sebelum menyimpan!",
      });
      return;
    }

    // Pastikan setidaknya ada data di modul
    if (modules.some((m) => !m.title || !m.duration)) {
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Data Modul Belum Lengkap",
        description: "Harap lengkapi semua judul dan durasi modul materi!",
      });
      return;
    }

    try {
      // Mapping ke model backend "Course"
      const courseData = {
        name: formData.title,
        tutorId: formData.tutorId,
        kategori: formData.category,
        durasi: formData.duration,
        deskripsi: formData.description,
        modules: modules.map((m) => ({ title: m.title, duration: m.duration })),
      };

      const response = await fetch("http://localhost:5001/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        setPopup({
          isOpen: true,
          type: "success",
          title: "Kursus Berhasil Ditambahkan! 🚀",
          description: "Kursus baru berhasil ditambahkan ke Pusat Course! Mengalihkan ke dashboard...",
        });
        console.log("Response:", result);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setPopup({
          isOpen: true,
          type: "danger",
          title: "Gagal Menambahkan",
          description: result.message || "Terjadi kesalahan saat menambahkan kursus.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Kesalahan Koneksi",
        description: "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
      });
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

            {/* Input Judul Menggunakan Komponen Input Reusable */}
            <Input
              type="text"
              id="title"
              name="title"
              label="Judul Kursus"
              value={formData.title}
              onChange={handleInputChange}
            />

            <div className={styles.rowGroup}>
              {/* Select Kategori (Meniru style Input) */}
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
                    required
                    style={{ cursor: "pointer", appearance: "none" }}
                  >
                    <option value="" disabled hidden></option>
                    <option value="programming">Pemrograman</option>
                    <option value="design">UI/UX Design</option>
                    <option value="business">Bisnis & Marketing</option>
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

              {/* Input Harga Menggunakan Komponen Input Reusable */}
              <div style={{ marginBottom: "-1rem" }}>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  label="Durasi (Menit)"
                  icon={FiClock}
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Textarea Deskripsi (Meniru style Input) */}
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
                  required
                ></textarea>
                <label
                  htmlFor="description"
                  className={inputStyles.floatingLabel}
                >
                  Deskripsi Singkat
                </label>
              </div>
            </div>

            {/* Thumbnail Upload */}
            
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
              Tambahkan video atau materi yang akan dipelajari dalam kursus ini
              secara berurutan.
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
              Pastikan semua data sudah terisi dengan benar sebelum menyimpan.
            </p>
          </div>
          <button type="submit" className={styles.saveBtn}>
            <FiSave size={20} /> Simpan Kursus
          </button>
        </motion.div>
      </form>

      {/* POPUP */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        buttonText={popup.type === "success" ? "OK" : "Tutup"}
        onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
