import React, { useState, useEffect } from "react";
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
  FiAlertCircle,
} from "react-icons/fi";
import { Popup } from "@/components/Popup/Popup";

// --- HELPER UNTUK EXTRAS (Sama dengan SearchPage) ---
const getCourseExtras = (category) => {
  const mapping = {
    "Frontend": {
      color: "#38BDF8",
      emoji: "👩‍💻",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600"
    },
    "Backend": {
      color: "#F472B6",
      emoji: "⚙️",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600"
    },
    "UI/UX Design": {
      color: "#FACC15",
      emoji: "🎨",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&q=80&w=600"
    },
    "Mobile Dev": {
      color: "#10B981",
      emoji: "📱",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600"
    },
    "Data Science": {
      color: "#A78BFA",
      emoji: "📊",
      image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=600"
    },
    "Matematika": {
      color: "#FB923C",
      emoji: "📐",
      image: "https://images.unsplash.com/photo-1509228468518-180dd482270b?auto=format&fit=crop&q=80&w=600"
    },
    "Bahasa Inggris": {
      color: "#6366F1",
      emoji: "🇬🇧",
      image: "https://images.unsplash.com/photo-1543165796-5426273eaab3?auto=format&fit=crop&q=80&w=600"
    },
    "Bahasa Indonesia": {
      color: "#EF4444",
      emoji: "🇮🇩",
      image: "https://images.unsplash.com/photo-1518173946687-a4c8a9b746f4?auto=format&fit=crop&q=80&w=600"
    },
    "Fisika": {
      color: "#14B8A6",
      emoji: "⚛️",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600"
    },
  };
  return mapping[category] || {
    color: "#94A3B8",
    emoji: "📚",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600"
  };
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ isOpen: false });

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/course/${id}`);
        const data = await response.json();

        if (response.ok) {
          const extras = getCourseExtras(data.kategori);
          setCourseData({
            id: data.id,
            title: data.name,
            category: data.kategori,
            instructor: data.tutor,
            instructorRole: "Expert Mentor",
            rating: 5.0,
            reviews: 0,
            timePrice: data.durasi + " Menit",
            color: extras.color,
            description: data.deskripsi,
            thumbnail: extras.image,
            details: {
              duration: data.durasi + " Menit",
              modules: 5,
              level: "Semua Level",
              certificate: true,
            },
            syllabus:
              data.modules && data.modules.length > 0
                ? data.modules.map((m, idx) => ({
                    id: idx + 1,
                    title: m.title,
                    duration: m.duration + " Menit",
                    isFree: idx === 0, // Modul pertama kita buat gratis sebagai preview
                  }))
                : [
                    { id: 1, title: "Pembukaan & Overview", duration: "10 Mnt", isFree: true },
                    { id: 2, title: "Materi Utama Bagian 1", duration: "30 Mnt", isFree: false },
                    { id: 3, title: "Materi Utama Bagian 2", duration: "45 Mnt", isFree: false },
                    { id: 4, title: "Sesi Diskusi & Tanya Jawab", duration: "25 Mnt", isFree: false },
                    { id: 5, title: "Penutup & Kesimpulan", duration: "10 Mnt", isFree: false },
                  ],
          });
        }
      } catch (error) {
        console.error("Error fetching course detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Memuat...">
        <div className={styles.loadingWrapper}>
          <p>Sedang mengambil data kursus...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!courseData) {
    return (
      <DashboardLayout title="Error">
        <div className={styles.loadingWrapper}>
          <p>Kursus tidak ditemukan atau terjadi kesalahan.</p>
          <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
            Kembali
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
                <FiUser className={styles.mentorHeaderIcon} />
                <h3 className={styles.mentorHeaderTitle}>Mentor Eksklusif</h3>
              </div>

              <div className={styles.mentorContent}>
                {/* Bagian Atas: Profil Row (Avatar + Identitas) */}
                <div className={styles.mentorProfileRow}>
                  <motion.div
                    whileHover={{ rotate: -5, scale: 1.05 }}
                    className={styles.mentorAvatar}
                  >
                    {courseData.instructor.charAt(0)}
                  </motion.div>

                  <div className={styles.mentorIdentity}>
                    <span className={styles.mentorRole}>
                      {courseData.instructorRole}
                    </span>
                    <h2 className={styles.mentorName}>
                      {courseData.instructor}
                    </h2>
                    <div className={styles.mentorStats}>
                      <FiStar
                        style={{
                          fill: "#facc15",
                          color: "#facc15",
                          fontSize: "1.1rem",
                        }}
                      />
                      <span>{courseData.rating}</span>
                      <span className={styles.reviewText}>
                        ({courseData.reviews} ulasan)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian Bawah: Deskripsi Mentor */}
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
                  onClick={() => setPopup({ isOpen: true })}
                >
                  Lihat Profil Lengkap
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        type="success"
        icon={<FiAlertCircle />}
        title="Fitur Segera Hadir 🚧"
        description="Tampilan profil lengkap mentor akan segera tersedia. Nantikan update berikutnya!"
        buttonText="OK, Mengerti"
        onAction={() => setPopup({ isOpen: false })}
      />
    </DashboardLayout>
  );
}
