import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./CourseDetailPage.module.css";
import {
  FiClock,
  FiBook,
  FiAward,
  FiStar,
  FiChevronDown,
  FiPlayCircle,
  FiUser,
} from "react-icons/fi";

// --- DUMMY DATA ---
const courseData = {
  id: 1,
  title: "Masterclass React JS & Next JS",
  category: "Programming",
  instructor: "Grace Hopper",
  instructorRole: "Senior Software Engineer",
  rating: 4.8,
  reviews: 124,
  timePrice: "120 Menit",
  color: "#38BDF8",
  description:
    "Pelajari React JS dari dasar hingga mahir, lengkap dengan implementasi Next.js untuk membuat aplikasi web modern yang cepat dan SEO friendly.",
  thumbnail:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
  details: {
    duration: "12 Jam",
    modules: 24,
    level: "Pemula - Menengah",
    certificate: true,
  },
  syllabus: [
    { id: 1, title: "Pengenalan React", duration: "45 Mnt", isFree: true },
    {
      id: 2,
      title: "State & Props dalam React",
      duration: "1 Jam 10 Mnt",
      isFree: false,
    },
    {
      id: 3,
      title: "React Hooks (useState, useEffect)",
      duration: "2 Jam",
      isFree: false,
    },
    {
      id: 4,
      title: "Routing dengan React Router",
      duration: "1 Jam 30 Mnt",
      isFree: false,
    },
    {
      id: 5,
      title: "Pengenalan Next.js & SSR",
      duration: "2 Jam 15 Mnt",
      isFree: false,
    },
  ],
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <DashboardLayout title="Detail Kursus">
      <div className={styles.container}>
        {/* --- HERO HEADER --- */}
        <motion.div
          className={styles.heroHeader}
          style={{ backgroundColor: courseData.color || "var(--primary-red)" }}
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
                <FiStar className={styles.starIcon} /> {courseData.rating} (
                {courseData.reviews} ulasan)
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

        {/* --- CONTENT SPLIT LAYOUT --- */}
        <div className={styles.splitLayout}>
          {/* KOLOM KIRI (Main Content) */}
          <div className={styles.mainContentCard}>
            <div className={styles.cardHeader}>
              <div className={styles.tabNav}>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "6px 6px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={`${styles.tabBtn} ${activeTab === "about" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("about")}
                >
                  Detail & Pendaftaran
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "6px 6px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={`${styles.tabBtn} ${activeTab === "syllabus" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("syllabus")}
                >
                  Silabus Materi
                </motion.button>
              </div>
            </div>

            <div className={styles.tabContent}>
              <AnimatePresence mode="wait">
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.aboutSection}
                  >
                    {/* Grid Detail Kelas */}
                    <div className={styles.detailsGrid}>
                      {[
                        {
                          label: "Durasi Belajar",
                          value: courseData.details.duration,
                          icon: <FiClock />,
                        },
                        {
                          label: "Total Modul",
                          value: `${courseData.details.modules} Video`,
                          icon: <FiBook />,
                        },
                        {
                          label: "Sertifikat",
                          value: courseData.details.certificate
                            ? "Diberikan"
                            : "Tidak",
                          icon: <FiAward />,
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -4, boxShadow: "5px 5px 0px #000" }}
                          className={styles.detailCard}
                        >
                          <div className={styles.detailCardIcon}>
                            {item.icon}
                          </div>
                          <p className={styles.detailCardLabel}>{item.label}</p>
                          <p className={styles.detailCardValue}>{item.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Area Pendaftaran (CTA Box) */}
                    <div className={styles.ctaBox}>
                      <div className={styles.ctaPriceContainer}>
                        <p className={styles.ctaPriceLabel}>
                          Investasi Belajar
                        </p>
                        <h2 className={styles.ctaPrice}>
                          {courseData.timePrice}
                        </h2>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: SILABUS */}
                {activeTab === "syllabus" && (
                  <motion.div
                    key="syllabus"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.syllabusSection}
                  >
                    <div className={styles.syllabusList}>
                      {courseData.syllabus.map((item, idx) => (
                        <div key={item.id} className={styles.syllabusItem}>
                          <div className={styles.syllNumber}>{idx + 1}</div>
                          <div className={styles.syllText}>
                            <h4>{item.title}</h4>
                            <span>
                              <FiPlayCircle /> {item.duration}
                            </span>
                          </div>
                          {item.isFree ? (
                            <span className={styles.freeBadge}>
                              Preview Gratis
                            </span>
                          ) : (
                            <FiChevronDown className={styles.lockIcon} />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* KOLOM KANAN (Informasi Mentor) */}
          <div className={styles.sidebarWrap}>
            <div className={styles.mentorCard}>
              <div className={styles.mentorHeader}>
                <h3 className={styles.mentorHeaderTitle}>Mentor Eksklusif</h3>
              </div>

              <div className={styles.mentorContent}>
                <motion.div
                  whileHover={{ rotate: -5, scale: 1.05 }}
                  className={styles.mentorAvatarLg}
                >
                  {courseData.instructor.charAt(0)}
                </motion.div>

                <h2 className={styles.mentorName}>{courseData.instructor}</h2>
                <span className={styles.mentorRole}>
                  {courseData.instructorRole}
                </span>

                <div className={styles.mentorStats}>
                  <FiStar
                    style={{
                      fill: "#facc15",
                      color: "#facc15",
                      fontSize: "1.2rem",
                    }}
                  />
                  <span>{courseData.rating}</span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      fontWeight: 700,
                    }}
                  >
                    ({courseData.reviews} ulasan)
                  </span>
                </div>

                <p className={styles.mentorBio}>
                  Membantu Anda menguasai teknologi web modern dengan pendekatan
                  praktis, studi kasus dunia nyata, dan standar industri.
                </p>
              </div>

              <div className={styles.mentorAction}>
                <motion.button
                  whileHover={{
                    y: -3,
                    boxShadow: "5px 5px 0px #000",
                    backgroundColor: "#f9fafb",
                  }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={styles.secondaryBtn}
                  onClick={() => alert("Menuju profil mentor...")}
                >
                  Lihat Profil Lengkap
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
