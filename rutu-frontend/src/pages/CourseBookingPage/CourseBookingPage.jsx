import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiBookOpen,
  FiUser,
  FiStar,
} from "react-icons/fi";
import styles from "./CourseBookingPage.module.css";
import { useCourseBooking } from "@/hooks/useCourseBooking";
import { getCourseExtras } from "@/constants/courseData";
import { useCourseDetail } from "@/hooks/useCourseDetail";

export default function CourseBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseData } = useCourseDetail();

  const {
    course,
    isLoading,
    isError,
    formData,
    popup,
    bookingMutation,
    setPopup,
    handleInputChange,
    handleBooking,
  } = useCourseBooking(id, user);

  if (isLoading) {
    return (
      <DashboardLayout title="Memuat Halaman Booking...">
        <div className={styles.loadingState}>Memuat data kursus... ⏳</div>
      </DashboardLayout>
    );
  }

  if (isError || !course) {
    return (
      <DashboardLayout title="Terjadi Kesalahan">
        <div className={styles.loadingState}>❌ Kursus tidak ditemukan.</div>
      </DashboardLayout>
    );
  }

  const extras = getCourseExtras(course.kategori || "General");

  return (
    <DashboardLayout title={`Booking Session`}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Jadwalkan Sesi Kamu</h1>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(`/search`)}
          >
            <FiArrowLeft /> Kembali
          </button>
        </div>

        <div className={styles.bookingSection}>
          {/* KOLOM KIRI: INFO KURSUS (Neo-Brutalism Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={styles.courseSummaryCard}
            style={{ backgroundColor: extras.color || "#facc15" }}
          >
            <span className={styles.ratingBadge}>
              <FiStar /> {courseData.rating} ({courseData.reviews} ulasan)
            </span>

            <h2 className={styles.courseTitle}>{course.name}</h2>

            <p className={styles.courseDescription}>
              {course.deskripsi ||
                "Kursus ini akan membimbingmu menguasai materi secara mendalam dengan metode pembelajaran yang interaktif dan mudah dipahami."}
            </p>

            <div className={styles.courseMeta}>
              <div className={styles.metaItem}>
                <FiUser className={styles.metaIcon} />
                <div>
                  <span>Tutor</span>
                  <strong>{course.tutor}</strong>
                </div>
              </div>
              <div className={styles.metaItem}>
                <FiClock className={styles.metaIcon} />
                <div>
                  <span>Durasi Sesi</span>
                  <strong>{course.durasi} Menit</strong>
                </div>
              </div>
              <div className={styles.metaItem}>
                <FiBookOpen className={styles.metaIcon} />
                <div>
                  <span>Kategori</span>
                  <strong>{course.kategori}</strong>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KOLOM KANAN: FORMULIR BOOKING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={styles.formCard}
          >
            <div className={styles.formHeader}>
              <h3>Detail Reservasi</h3>
              <p>Tentukan kapan kamu ingin memulai sesi belajar ini.</p>
            </div>

            <form onSubmit={handleBooking} className={styles.formContent}>
              <Input
                label="Nama Lengkap Siswa"
                icon={FiUser}
                value={user?.name || ""}
                readOnly
                disabled
              />

              <div className={styles.rowGroup}>
                <Input
                  type="date"
                  label="Tanggal Sesi"
                  name="date"
                  icon={FiCalendar}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="time"
                  label="Waktu Sesi"
                  name="time"
                  icon={FiClock}
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                isTextarea
                label="Catatan untuk Tutor (Opsional)"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
              />

              <div className={styles.actionRow}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending
                    ? "Memproses..."
                    : "Booking Sekarang"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="Tutup"
        onAction={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
