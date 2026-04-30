import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";
import { Popup } from "@/components/Popup/Popup";
import api from "@/utils/api";
import { getImageUrl } from "@/utils/imageHelper";
import { CATEGORY_COLORS } from "@/constants/categoryConstants";
import { getCategoryIcon } from "@/constants/categoryIconHelper";

import {
  FiClock,
  FiStar,
  FiArrowRight,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function CourseCard({ course, isMyCourse, onRefresh }) {
  const navigate = useNavigate();

  // State untuk popup konfirmasi hapus khusus mode MyCourse
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "",
    title: "",
    description: "",
  });

  const safeCategory = course.category || course.kategori || "General"; // Sesuaikan dengan properti API Anda

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.charAt(0).toUpperCase();
  };

  // Logika khusus untuk menghapus kursus
  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${course.id}`);
      setShowDeletePopup(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      setShowDeletePopup(false);
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Gagal Menghapus",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus kursus.",
      });
    }
  };

  // [LOGIKA PLACEHOLDER KATEGORI]
  const hasImage = course.thumbnail && course.thumbnail.length > 5;
  const bgColor = CATEGORY_COLORS[safeCategory] || CATEGORY_COLORS["Default"];

  return (
    <>
      <div className={styles.neoCard}>
        {/* --- BAGIAN THUMBNAIL / BANNER --- */}
        <div className={styles.cardBanner} style={{ backgroundColor: bgColor }}>
          {hasImage ? (
            <img
              src={getImageUrl(course.thumbnail)}
              alt={course.title || course.name}
              className={styles.bannerImage}
              loading="lazy"
            />
          ) : (
            // Tampilkan Ikon Kategori Besar jika tidak ada gambar
            <div className={styles.bannerOverlay}>
              <div className={styles.bannerIconWrapper}>
                {getCategoryIcon(safeCategory, 80)}
              </div>
            </div>
          )}

          <span className={styles.categoryBadge}>{safeCategory}</span>
          <div className={styles.durationBadge}>
            <FiClock />
            <span>
              {course.duration || course.durasi
                ? `${course.duration || course.durasi} Menit`
                : "0 Menit"}
            </span>
          </div>
        </div>

        {/* --- BAGIAN BODY KONTEN --- */}
        <div className={styles.cardBody}>
          <h3 className={styles.courseTitle}>{course.title || course.name}</h3>

          <div className={styles.mentorInfo}>
            <div
              className={styles.mentorAvatar}
              style={{ backgroundColor: bgColor }} // Avatar warna senada dengan banner
            >
              {course.authorImage ? (
                <img
                  src={getImageUrl(course.authorImage)}
                  alt={course.author || course.tutor}
                  className={styles.avatarImage}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#fff", // Pastikan kontras dengan background
                  }}
                >
                  {getInitials(course.author || course.tutor || "Saya")}
                </span>
              )}
            </div>
            <div className={styles.mentorText}>
              <span
                className={styles.mentorName}
                title={course.author || course.tutor}
              >
                {course.author || course.tutor || "Saya"}
              </span>
              <span className={styles.mentorRole}>Mentor</span>
            </div>
            <div className={styles.ratingBadge}>
              <FiStar className={styles.starIcon} />
              <span>{course.rating ? `${course.rating}.0` : "0.0"}</span>
            </div>
          </div>
        </div>

        {/* --- BAGIAN FOOTER / TOMBOL --- */}
        <div className={styles.cardFooter}>
          {isMyCourse ? (
            // Tampilan untuk Halaman My Course (3 Tombol)
            <>
              <button
                className={`${styles.actionBtn} ${styles.btnDetail}`}
                onClick={() => navigate(`/course/${course.id}`)}
                title="Detail"
              >
                <FiEye size={18} />
              </button>
              <button
                className={`${styles.actionBtn} ${styles.btnEdit}`}
                onClick={() => navigate(`/edit-course/${course.id}`)}
              >
                <FiEdit3 size={18} /> Edit
              </button>
              <button
                className={`${styles.actionBtn} ${styles.btnDelete}`}
                onClick={() => setShowDeletePopup(true)}
              >
                <FiTrash2 size={18} /> Hapus
              </button>
            </>
          ) : (
            // Tampilan Normal untuk Halaman Pencarian (2 Tombol)
            <>
              <button
                className={`${styles.actionBtn} ${styles.btnDetailText}`}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                Lihat Detail
              </button>
              {(() => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const tutorName = course.author || course.tutor;
                const isOwner = user.name === tutorName;

                return isOwner ? (
                  <button
                    className={`${styles.actionBtn} ${styles.btnEditSearch}`}
                    onClick={() => navigate(`/mycourses`)}
                  >
                    Edit <FiArrowRight />
                  </button>
                ) : (
                  <button
                    className={`${styles.actionBtn} ${styles.btnBooking}`}
                    onClick={() => navigate(`/course-booking/${course.id}`)}
                  >
                    Booking <FiArrowRight />
                  </button>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* POPUPS */}
      {isMyCourse && showDeletePopup && (
        <Popup
          isOpen={true}
          type="danger"
          icon={<FiAlertCircle />}
          title="Hapus Kursus?"
          description={`Apakah kamu yakin ingin menghapus kursus "${course.title || course.name}"? Tindakan ini tidak dapat dibatalkan.`}
          buttonText="Hapus Sekarang"
          onAction={handleDelete}
          secondaryButtonText="Batal"
          onSecondaryAction={() => setShowDeletePopup(false)}
        />
      )}

      {isMyCourse && (
        <Popup
          isOpen={popup.isOpen}
          type={popup.type}
          icon={
            popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />
          }
          title={popup.title}
          description={popup.description}
          buttonText="Tutup"
          onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
        />
      )}
    </>
  );
}
