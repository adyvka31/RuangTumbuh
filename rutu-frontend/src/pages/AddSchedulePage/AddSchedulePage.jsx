import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // Tambah useLocation
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./AddSchedulePage.module.css";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
import inputStyles from "@/components/Input/Input.module.css";

import {
  FiCalendar,
  FiClock,
  FiType,
  FiUsers,
  FiVideo,
  FiSave,
  FiX,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";

export default function AddSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk menangkap data yang dilempar

  // Deteksi apakah sedang dalam Mode Edit
  const editData = location.state?.editData;
  const isEdit = !!editData;

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    durationMinutes: "60",
    category: "Mentoring",
    platform: "Google Meet",
    partner: "",
  });

  // Jika Mode Edit aktif, otomatis isi form dengan data lama
  useEffect(() => {
    if (isEdit && editData) {
      const d = new Date(editData.date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      const formattedTime = editData.time.replace(".", ":");

      setFormData({
        title: editData.title.replace("Mentoring: ", "").replace("Kelas: ", ""),
        date: `${yyyy}-${mm}-${dd}`,
        time: formattedTime,
        durationMinutes: "60",
        category: editData.category,
        platform: editData.platform,
        partner: editData.partner,
      });
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time) {
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Form Tidak Lengkap",
        description: "Harap isi Nama Kegiatan, Tanggal, dan Waktu!",
      });
      return;
    }

    setLoading(true);

    try {
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!localUser.id) return;

      // Logika Endpoint Dinamis (POST untuk Baru, PUT untuk Edit)
      const endpoint = isEdit
        ? `http://localhost:5001/api/schedules/${editData.id}`
        : `http://localhost:5001/api/schedules`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: localUser.id, ...formData }),
      });

      const result = await response.json();

      if (response.ok) {
        setPopup({
          isOpen: true,
          type: "success",
          title: isEdit
            ? "Jadwal Diperbarui! 🔄"
            : "Jadwal Berhasil Dibuat! 📅",
          description: isEdit
            ? "Data kalender Anda berhasil di-reschedule."
            : "Jadwal baru telah ditambahkan ke kalender Anda.",
        });
        setTimeout(() => {
          navigate("/schedule");
        }, 2000);
      } else {
        setPopup({
          isOpen: true,
          type: "danger",
          title: "Gagal Menyimpan",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error submit schedule:", error);
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Kesalahan Koneksi",
        description: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setLoading(false);
    }
  };

  // (SISA KODE JSX RENDER SAMA SEPERTI SEBELUMNYA, HANYA UBAH TEXT DINAMIS)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <DashboardLayout
      title={isEdit ? "Reschedule Jadwal" : "Tambah Jadwal Baru"}
    >
      <motion.form
        onSubmit={handleSubmit}
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className={styles.pageHeader}>
          {/* Judul berubah otomatis */}
          <h1 className={styles.pageTitle}>
            {isEdit ? "Reschedule Jadwal" : "Buat Jadwal Baru"}
          </h1>
          <motion.button
            type="button"
            whileHover={{ x: -4 }}
            className={styles.backBtn}
            onClick={() => navigate("/schedule")}
          >
            <FiArrowLeft /> Kembali ke Kalender
          </motion.button>
        </div>

        <div className={styles.contentGrid}>
          <motion.div variants={itemVariants} className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#38BDF8" }}
              >
                <FiCalendar />
              </div>
              <h3>Waktu & Kegiatan</h3>
            </div>

            <Input
              type="text"
              name="title"
              id="title"
              label="Nama Kegiatan"
              icon={FiType}
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className={styles.rowGroup}>
              <div style={{ marginBottom: "-1rem" }}>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  label="Tanggal Pelaksanaan"
                  icon={FiCalendar}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ marginBottom: "-1rem" }}>
                <Input
                  type="time"
                  name="time"
                  id="time"
                  label="Waktu Mulai"
                  icon={FiClock}
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.rowGroup}>
              <div
                className={inputStyles.inputContainer}
                style={{ marginBottom: 0 }}
              >
                <div className={inputStyles.inputWrapper}>
                  <select
                    name="durationMinutes"
                    id="durationMinutes"
                    className={inputStyles.inputForm}
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    style={{ cursor: "pointer", appearance: "none" }}
                  >
                    <option value="30">30 Menit</option>
                    <option value="60">1 Jam</option>
                    <option value="90">1.5 Jam</option>
                    <option value="120">2 Jam</option>
                  </select>
                  <label
                    htmlFor="durationMinutes"
                    className={inputStyles.floatingLabel}
                    style={{
                      top: 0,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--primary-yellow)",
                    }}
                  >
                    Durasi Sesi
                  </label>
                  <FiChevronDown className={inputStyles.inputIcon} />
                </div>
              </div>

              <div
                className={inputStyles.inputContainer}
                style={{ marginBottom: 0 }}
              >
                <div className={inputStyles.inputWrapper}>
                  <select
                    name="category"
                    id="category"
                    className={inputStyles.inputForm}
                    value={formData.category}
                    onChange={handleChange}
                    style={{ cursor: "pointer", appearance: "none" }}
                  >
                    <option value="Mentoring">Mentoring</option>
                    <option value="Kelas">Kelas</option>
                    <option value="Diskusi">Diskusi</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                  <label
                    htmlFor="category"
                    className={inputStyles.floatingLabel}
                    style={{
                      top: 0,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--primary-yellow)",
                    }}
                  >
                    Kategori
                  </label>
                  <FiChevronDown className={inputStyles.inputIcon} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#FACC15" }}
              >
                <FiUsers />
              </div>
              <h3>Detail Partisipan</h3>
            </div>

            <Input
              type="text"
              name="platform"
              id="platform"
              label="Platform / Lokasi"
              icon={FiVideo}
              value={formData.platform}
              onChange={handleChange}
              placeholder="Contoh: Google Meet, Zoom, Offline"
              required
            />
            <Input
              type="text"
              name="partner"
              id="partner"
              label="Rekan / Mentor / Siswa"
              icon={FiUsers}
              value={formData.partner}
              onChange={handleChange}
              placeholder="Nama rekan diskusi..."
              required
            />

            <div className={styles.infoBox}>
              <FiInfo className={styles.infoIcon} />
              <p>
                {isEdit
                  ? "Jadwal akan diperbarui dan otomatis disinkronkan ke kalender utama Anda."
                  : "Jadwal yang dibuat secara manual akan otomatis disetujui dan langsung muncul di kalender Anda."}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div className={styles.actionBar} variants={itemVariants}>
          <div className={styles.actionText}>
            <h3>Sudah yakin? 🚀</h3>
            <p>Pastikan tanggal dan waktu sudah sesuai sebelum menyimpan.</p>
          </div>

          <div className={styles.actionButtons}>
            <motion.button
              type="button"
              whileHover={{ y: -3, boxShadow: "6px 6px 0px #000" }}
              whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
              className={styles.cancelBtn}
              onClick={() => navigate("/schedule")}
            >
              <FiX size={20} /> Batal
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ y: -4, boxShadow: "8px 8px 0px #000" }}
              whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
              className={styles.saveBtn}
              disabled={loading}
            >
              <FiSave size={20} />{" "}
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Jadwal"}
            </motion.button>
          </div>
        </motion.div>
      </motion.form>

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
