import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyCourseCard.module.css";
import { Popup } from "../Popup/Popup";
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function MyCourseCard({ course, onRefresh }) {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, type: "success", title: "", description: "" });

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/course/${course.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeletePopup(false);
        if (onRefresh) onRefresh();
      } else {
        const result = await response.json();
        setShowDeletePopup(false);
        setPopup({
          isOpen: true,
          type: "danger",
          title: "Gagal Menghapus",
          description: result.message || "Terjadi kesalahan saat menghapus kursus.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setShowDeletePopup(false);
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Kesalahan Koneksi",
        description: "Terjadi kesalahan saat menghapus kursus. Periksa koneksi Anda.",
      });
    }
  };

  return (
    <>
      <div className={styles.neoCard}>
        <div className={styles.neoCardHeader}>
          <div
            className={styles.avatarWrap}
            style={{ backgroundColor: course.color || "#38BDF8" }}
          >
            {course.emoji || "👤"}
          </div>
          <div className={styles.headerInfo}>
            <h4>{course.author || "Saya"}</h4>
            <span>MENTOR</span>
          </div>
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.topicTitle}>
            <FiBookOpen /> {course.title}
          </h3>

          <div className={styles.timeInfo}>
            <div className={styles.timeBadge}>
              <FiCalendar /> {course.category || "General"}
            </div>
            <div className={styles.timeBadge}>
              <FiClock /> {course.duration || "0"} Menit
            </div>
          </div>

          <div className={styles.requestNote}>
            <strong>DESKRIPSI KURSUS:</strong>
            <p>{course.description || "Tidak ada deskripsi."}</p>
          </div>
        </div>

        <div className={styles.neoCardFooter}>
          <button
            className={`${styles.actionBtn} ${styles.btnDetail}`}
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <FiEye size={18} /> Detail
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
        </div>
      </div>

      {/* Konfirmasi Hapus */}
      {showDeletePopup && (
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

      {/* Error Popup */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="Tutup"
        onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
      />
    </>
  );
}
