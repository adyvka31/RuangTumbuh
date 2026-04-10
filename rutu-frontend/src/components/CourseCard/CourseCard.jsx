import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";
import { getCourseExtras } from "@/constants/courseData";
import { Popup } from "@/components/Popup/Popup"; // Pastikan path ini benar
import api from "@/utils/api";
import {
  FiClock,
  FiStar,
  FiArrowRight,
  FiCode,
  FiServer,
  FiDroplet,
  FiSmartphone,
  FiBookOpen,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

// Tambahkan isMyCourse dan onRefresh sebagai properti baru
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

  const safeCategory = course.category || "General";
  const extras = getCourseExtras(safeCategory);

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase().replace(/[^a-z0-9]/g, "")) {
      case "frontend":
        return <FiCode className={styles.bannerIcon} />;
      case "backend":
        return <FiServer className={styles.bannerIcon} />;
      case "uiuxdesign":
        return <FiDroplet className={styles.bannerIcon} />;
      case "mobiledev":
        return <FiSmartphone className={styles.bannerIcon} />;
      default:
        return <FiBookOpen className={styles.bannerIcon} />;
    }
  };

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

  return (
    <>
      <div className={styles.neoCard}>
        <div
          className={styles.cardBanner}
          style={{ backgroundColor: extras.color }}
        >
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className={styles.bannerImage}
            />
          )}
          <div className={styles.bannerOverlay}>
            {getCategoryIcon(course.category)}
          </div>
          <span className={styles.categoryBadge}>
            {course.category || "General"}
          </span>
          <div className={styles.durationBadge}>
            <FiClock />
            <span>
              {course.duration ? `${course.duration} Menit` : "0 Menit"}
            </span>
          </div>
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.courseTitle}>{course.title}</h3>

          <div className={styles.mentorInfo}>
            <div
              className={styles.mentorAvatar}
              style={{ backgroundColor: extras.color }}
            >
              {course.authorImage ? (
                <img
                  src={course.authorImage}
                  alt={course.author}
                  className={styles.avatarImage}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "1px",
                  }}
                >
                  {getInitials(course.author || "Saya")}
                </span>
              )}
            </div>
            <div className={styles.mentorText}>
              <span className={styles.mentorName} title={course.author}>
                {course.author || "Saya"}
              </span>
              <span className={styles.mentorRole}>Mentor</span>
            </div>
            <div className={styles.ratingBadge}>
              <FiStar className={styles.starIcon} />
              <span>{course.rating ? `${course.rating}.0` : "5.0"}</span>
            </div>
          </div>
        </div>

        <div className={styles.cardFooter}>
          {/* LOGIKA KONDISIONAL RENDER TOMBOL */}
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
                const isOwner = user.name === course.author;

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

      {/* POPUP KHUSUS MY COURSE */}
      {isMyCourse && showDeletePopup && (
        <Popup
          isOpen={true}
          type="danger"
          icon={<FiAlertCircle />}
          title="Hapus Kursus?"
          description={`Apakah kamu yakin ingin menghapus kursus "${course.title}"? Tindakan ini tidak dapat dibatalkan.`}
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
