import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./CourseDetailPage.module.css";
import { Popup } from "@/components/Popup/Popup";
import { useCourseDetail } from "@/hooks/useCourseDetail";
import { Skeleton } from "@/components/Skeleton/Skeleton"; // [TAMBAHAN] Import Skeleton
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

  // =========================================
  // TAMPILAN SKELETON LOADING
  // =========================================
  if (loading) {
    return (
      <DashboardLayout title="Memuat Detail...">
        <div className={styles.container}>
          {/* HERO HEADER SKELETON */}
          <div
            className={styles.heroHeader}
            style={{ backgroundColor: "#f8fafc", border: "2px solid #e2e8f0" }}
          >
            <div
              className={styles.heroImageWrap}
              style={{ backgroundColor: "transparent" }}
            >
              <Skeleton
                width="100%"
                height="100%"
                style={{ minHeight: "250px", borderRadius: "16px" }}
              />
            </div>
            <div className={styles.heroTextContent}>
              <div className={styles.badgeGroup}>
                <Skeleton
                  width="100px"
                  height="28px"
                  style={{ borderRadius: "14px" }}
                />
                <Skeleton
                  width="140px"
                  height="28px"
                  style={{ borderRadius: "14px" }}
                />
              </div>
              <Skeleton
                width="85%"
                height="40px"
                style={{ marginTop: "16px", marginBottom: "16px" }}
              />
              <Skeleton
                width="100%"
                height="18px"
                style={{ marginBottom: "8px" }}
              />
              <Skeleton
                width="90%"
                height="18px"
                style={{ marginBottom: "24px" }}
              />
              <div className={styles.instructorInfo}>
                <Skeleton variant="circle" width="36px" height="36px" />
                <Skeleton
                  width="180px"
                  height="20px"
                  style={{ marginLeft: "12px" }}
                />
              </div>
            </div>
          </div>

          <div className={styles.splitLayout}>
            {/* MAIN CONTENT SKELETON */}
            <div className={styles.mainContentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.tabNav}>
                  <Skeleton
                    width="180px"
                    height="40px"
                    style={{ borderRadius: "8px", marginRight: "12px" }}
                  />
                  <Skeleton
                    width="140px"
                    height="40px"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div className={styles.tabContent}>
                <div className={styles.detailsGrid}>
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className={styles.detailCard}>
                      <div
                        className={styles.detailCardIcon}
                        style={{ backgroundColor: "transparent" }}
                      >
                        <Skeleton variant="circle" width="48px" height="48px" />
                      </div>
                      <Skeleton
                        width="100px"
                        height="16px"
                        style={{ marginTop: "12px", marginBottom: "8px" }}
                      />
                      <Skeleton width="120px" height="22px" />
                    </div>
                  ))}
                </div>
                <div className={styles.ctaBox}>
                  <div className={styles.ctaPriceContainer}>
                    <Skeleton
                      width="120px"
                      height="16px"
                      style={{ marginBottom: "8px" }}
                    />
                    <Skeleton width="160px" height="36px" />
                  </div>
                  <Skeleton
                    width="200px"
                    height="50px"
                    style={{ borderRadius: "12px" }}
                  />
                </div>
              </div>
            </div>

            {/* SIDEBAR MENTOR SKELETON */}
            <div className={styles.sidebarWrap}>
              <div className={styles.mentorCard}>
                <div className={styles.mentorHeader}>
                  <Skeleton
                    variant="circle"
                    width="24px"
                    height="24px"
                    style={{ marginRight: "10px" }}
                  />
                  <Skeleton width="140px" height="24px" />
                </div>
                <div className={styles.mentorContent}>
                  <div className={styles.mentorProfileRow}>
                    <Skeleton variant="circle" width="56px" height="56px" />
                    <div
                      className={styles.mentorIdentity}
                      style={{ marginLeft: "12px", flex: 1 }}
                    >
                      <Skeleton
                        width="80px"
                        height="14px"
                        style={{ marginBottom: "8px" }}
                      />
                      <Skeleton width="100%" height="24px" />
                    </div>
                  </div>
                  <Skeleton
                    width="100%"
                    height="45px"
                    style={{ borderRadius: "10px", marginTop: "20px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================
  // TAMPILAN ERROR / KOSONG
  // =========================================
  if (isError || !courseData)
    return (
      <DashboardLayout title="Error">
        <div
          className={styles.loadingWrapper}
          style={{ textAlign: "center", padding: "50px" }}
        >
          <p style={{ marginBottom: "20px" }}>Kursus tidak ditemukan.</p>
          <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
            Kembali
          </button>
        </div>
      </DashboardLayout>
    );

  // =========================================
  // TAMPILAN UTAMA
  // =========================================
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
        buttonText="Tutup"
        onAction={() => setPopup({ isOpen: false })}
      />
    </DashboardLayout>
  );
}
