import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./CourseDetailPage.module.css";
import { Popup } from "@/components/Popup/Popup";
import { useCourseDetail } from "@/hooks/useCourseDetail";
import {
  FiClock,
  FiBook,
  FiAward,
  FiStar,
  FiPlayCircle,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [popup, setPopup] = useState({ isOpen: false });
  const { id, courseData, loading, isError } = useCourseDetail();

  if (loading)
    return (
      <DashboardLayout title="Memuat...">
        <div className={styles.loadingWrapper}>
          <p>Sedang mengambil data...</p>
        </div>
      </DashboardLayout>
    );

  if (isError || !courseData)
    return (
      <DashboardLayout title="Error">
        <div className={styles.loadingWrapper}>
          <p>Kursus tidak ditemukan.</p>
          <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
            Kembali
          </button>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Detail Kursus">
      <div className={styles.container}>
        {/* HERO HEADER */}
        <motion.div
          className={styles.heroHeader}
          style={{ backgroundColor: courseData.color }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.heroImageWrap}>
            <img src={courseData.thumbnail} alt={courseData.title} />
          </div>
          <div className={styles.heroTextContent}>
            <div className={styles.badgeGroup}>
              <span className={styles.categoryBadge}>
                {courseData.category}
              </span>
              <span className={styles.ratingBadge}>
                <FiStar /> {courseData.rating} ({courseData.reviews} ulasan)
              </span>
            </div>
            <h1 className={styles.courseTitle}>{courseData.title}</h1>
            <p className={styles.courseDesc}>{courseData.description}</p>
            <div className={styles.instructorInfo}>
              <div className={styles.instructorAvatar}>
                {courseData.instructor.charAt(0)}
              </div>
              <span>
                Oleh <strong>{courseData.instructor}</strong>
              </span>
            </div>
          </div>
        </motion.div>

        <div className={styles.splitLayout}>
          <div className={styles.mainContentCard}>
            <div className={styles.cardHeader}>
              <div className={styles.tabNav}>
                <button
                  className={`${styles.tabBtn} ${activeTab === "about" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("about")}
                >
                  Detail & Pendaftaran
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "syllabus" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("syllabus")}
                >
                  Silabus Materi
                </button>
              </div>
            </div>

            <div className={styles.tabContent}>
              <AnimatePresence mode="wait">
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.detailsGrid}>
                      {[
                        {
                          label: "Durasi Belajar",
                          value: courseData.details.duration,
                          icon: <FiClock />,
                        },
                        {
                          label: "Total Modul",
                          value: `${courseData.details.modules} Materi`,
                          icon: <FiBook />,
                        },
                        {
                          label: "Sertifikat",
                          value: "Diberikan",
                          icon: <FiAward />,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className={styles.detailCard}>
                          <div className={styles.detailCardIcon}>
                            {item.icon}
                          </div>
                          <p>{item.label}</p>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                    <div className={styles.ctaBox}>
                      <div className={styles.ctaPriceContainer}>
                        <p>Investasi Belajar</p>
                        <h2>{courseData.timePrice}</h2>
                      </div>
                      <button
                        className={styles.enrollBtn}
                        onClick={() => navigate(`/course-booking/${id}`)}
                      >
                        Booking Sekarang 🔥
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "syllabus" && (
                  <motion.div
                    key="syllabus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.syllabusList}
                  >
                    {courseData.syllabus.map((item, idx) => (
                      <div key={item.id} className={styles.syllabusItem}>
                        <div className={styles.syllNumber}>{idx + 1}</div>
                        <div className={styles.syllText}>
                          <h4>{item.title}</h4>
                          <span>
                            <FiPlayCircle /> {item.duration}
                          </span>
                        </div>
                        {item.isFree && (
                          <span className={styles.freeBadge}>Gratis</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SIDEBAR MENTOR */}
          <div className={styles.sidebarWrap}>
            <div className={styles.mentorCard}>
              <div className={styles.mentorHeader}>
                <FiUser /> <h3>Mentor Eksklusif</h3>
              </div>
              <div className={styles.mentorContent}>
                <div className={styles.mentorProfileRow}>
                  <div className={styles.mentorAvatar}>
                    {courseData.instructor.charAt(0)}
                  </div>
                  <div className={styles.mentorIdentity}>
                    <span className={styles.mentorRole}>
                      {courseData.instructorRole}
                    </span>
                    <h2>{courseData.instructor}</h2>
                  </div>
                </div>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setPopup({ isOpen: true })}
                >
                  Lihat Profil Lengkap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        icon={<FiAlertCircle />}
        title="Segera Hadir 🚧"
        description="Fitur profil lengkap sedang dikembangkan."
        onAction={() => setPopup({ isOpen: false })}
      />
    </DashboardLayout>
  );
}
