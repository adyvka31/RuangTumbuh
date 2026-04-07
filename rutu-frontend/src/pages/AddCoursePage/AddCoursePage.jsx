import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./AddSchedulePage.module.css";
import inputStyles from "@/components/Input/Input.module.css";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
import { useAddSchedule } from "@/hooks/useAddSchedule";
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
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";

export default function AddSchedulePage() {
  const {
    formData,
    isEdit,
    error,
    popup,
    setPopup,
    isPending,
    handleChange,
    handleSubmit,
    navigate,
  } = useAddSchedule();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <DashboardLayout title={isEdit ? "Reschedule Jadwal" : "Tambah Jadwal"}>
      <motion.form
        onSubmit={handleSubmit}
        className={styles.container}
        initial="hidden"
        animate="show"
      >
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Reschedule Jadwal" : "Buat Jadwal Baru"}
          </h1>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/schedule")}
          >
            <FiArrowLeft /> Kembali
          </button>
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

            {error && <p className={styles.errorMsg}>{error}</p>}

            <Input
              name="title"
              label="Nama Kegiatan"
              icon={FiType}
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className={styles.rowGroup}>
              <Input
                type="date"
                name="date"
                label="Tanggal"
                icon={FiCalendar}
                value={formData.date}
                onChange={handleChange}
                required
              />
              <Input
                type="time"
                name="time"
                label="Waktu"
                icon={FiClock}
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.rowGroup}>
              <div className={inputStyles.inputContainer}>
                <div className={inputStyles.inputWrapper}>
                  <select
                    name="durationMinutes"
                    className={inputStyles.inputForm}
                    value={formData.durationMinutes}
                    onChange={handleChange}
                  >
                    <option value="30">30 Menit</option>
                    <option value="60">1 Jam</option>
                    <option value="120">2 Jam</option>
                  </select>
                  <label
                    className={inputStyles.floatingLabel}
                    style={{ color: "var(--primary-yellow)" }}
                  >
                    Durasi
                  </label>
                  <FiChevronDown className={inputStyles.inputIcon} />
                </div>
              </div>

              <div className={inputStyles.inputContainer}>
                <div className={inputStyles.inputWrapper}>
                  <select
                    name="category"
                    className={inputStyles.inputForm}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Mentoring">Mentoring</option>
                    <option value="Kelas">Kelas</option>
                    <option value="Diskusi">Diskusi</option>
                  </select>
                  <label
                    className={inputStyles.floatingLabel}
                    style={{ color: "var(--primary-yellow)" }}
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
              name="platform"
              label="Platform / Lokasi"
              icon={FiVideo}
              value={formData.platform}
              onChange={handleChange}
              required
            />
            <Input
              name="partner"
              label="Rekan / Mentor"
              icon={FiUsers}
              value={formData.partner}
              onChange={handleChange}
              required
            />
            <div className={styles.infoBox}>
              <FiInfo /> <p>Jadwal manual akan otomatis disetujui.</p>
            </div>
          </motion.div>
        </div>

        <div className={styles.actionBar}>
          <div className={styles.actionText}>
            <h3>Sudah yakin? 🚀</h3>
            <p>Pastikan data sudah sesuai.</p>
          </div>
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/schedule")}
            >
              <FiX /> Batal
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={isPending}
            >
              <FiSave />{" "}
              {isPending
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Jadwal"}
            </button>
          </div>
        </div>
      </motion.form>

      <Popup
        isOpen={popup.isOpen}
        icon={<FiCheckCircle />}
        title={popup.title}
        description={popup.description}
        onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
