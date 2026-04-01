import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";

// Ikon tambahan untuk UI yang lebih mewah
import { FiClock, FiVideo, FiStar, FiBook, FiAward, FiCalendar } from "react-icons/fi";

// Assets
import shape10 from "@/assets/shape10.svg";
import shape11 from "@/assets/shape11.svg";
import shape12 from "@/assets/shape12.svg";
import shape13 from "@/assets/shape13.svg";

export default function DashboardPage() {
  const navigate = useNavigate();

  // Mengambil nama user dari localStorage (seperti di Topbar)
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  // Ambil nama depan saja agar lebih akrab
  const userName = user ? user.name.split(" ")[0] : "Sobat";

  const statCards = [
    { label: "Poin Aktif", value: "300", color: "var(--primary-blue)", icon: <FiStar /> },
    { label: "Durasi Belajar", value: "4 Jam", color: "var(--primary-red)", icon: <FiClock /> },
    { label: "Sesi Mendatang", value: "2", color: "#ff90e8", icon: <FiCalendar /> },
    { label: "Kursus Selesai", value: "5", color: "var(--primary-yellow)", icon: <FiAward /> },
  ];

  const mentoringSessions = [
    {
      id: 1,
      time: "15:30 WIB",
      title: "[Wajib] Coding Camp 2026 - Pengenalan React",
      url: "https://zoom.us/j/123456789",
      status: "Berlangsung",
      color: "#FACC15",
      badgeColor: "#10B981", // Hijau
    },
    {
      id: 2,
      time: "09:00 WIB",
      title: "Mentoring 1-on-1: UI/UX Design Fundamental",
      url: "https://meet.google.com/abc-defg-hij",
      status: "Besok",
      color: "#38BDF8",
      badgeColor: "#3B82F6", // Biru
    },
    {
      id: 3,
      time: "19:00 WIB",
      title: "Diskusi Komunitas: Laravel vs NestJS",
      url: "https://discord.gg/ruangtumbuh",
      status: "Dibatalkan",
      color: "#ff66aa",
      badgeColor: "#EF4444", // Merah
    },
  ];

  // Konfigurasi animasi Framer Motion (Stagger Children)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } }
  };

  return (
    <DashboardLayout title="Dashboard">
      <motion.div 
        className={styles.contentFlex}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* --- BANNER SELAMAT DATANG --- */}
        <motion.section variants={itemVariants} className={styles.banner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>
              Halo, {userName} <span className={styles.waveEmoji} role="img" aria-label="wave">👋</span>
            </h2>
            <p className={styles.bannerSub}>Siap untuk belajar, berkembang, dan menjelajah hari ini?</p>
            <div className={styles.bannerButtons}>
              <button className={styles.bannerBtn} onClick={() => navigate("/search")}>
                <FiBook /> Mulai Belajar <div className={styles.bannerBtnArrow}>˃</div>
              </button>
              <button className={`${styles.bannerBtn} ${styles.btnSecondary}`} onClick={() => navigate("/add-course")}>
                <FiVideo /> Buka Sesi Mengajar <div className={styles.bannerBtnArrow}>˃</div>
              </button>
            </div>
          </div>
          <div className={styles.bannerDecor}>
            {[shape10, shape11, shape12, shape13].map((shape, i) => (
              <motion.img
                key={i}
                animate={{ y: [0, -(10 + i * 3), 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                src={shape} alt="Dekorasi" className={styles.mascot}
              />
            ))}
          </div>
        </motion.section>

        {/* --- STATISTIK GRID --- */}
        <motion.section variants={itemVariants} className={styles.statsGrid}>
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={styles.statCard}
              style={{ backgroundColor: card.color }}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>{card.label}</span>
                <div className={styles.statIcon}>{card.icon}</div>
              </div>
              <div className={styles.statValue}>{card.value}</div>
            </div>
          ))}
        </motion.section>

        {/* --- SESI MENTORING --- */}
        <motion.section variants={itemVariants} className={styles.mentoringSection}>
          <div className={styles.sectionHeader}>
            <h2>Sesi Mentoring Anda</h2>
            <span className={styles.seeAll} onClick={() => navigate("/schedule")}>Lihat Semua</span>
          </div>
          <div className={styles.mentoringList}>
            {mentoringSessions.map((session) => (
              <div
                key={session.id}
                className={styles.mentoringItem}
                style={{ backgroundColor: session.color }}
              >
                <div className={styles.itemContent}>
                  <div className={styles.itemIcon}>
                    <FiVideo size={28} />
                  </div>
                  <div className={styles.itemText}>
                    <span className={styles.itemTitle}>{session.title}</span>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemTime}><FiClock /> {session.time}</span>
                      <a href={session.url} className={styles.itemUrl} target="_blank" rel="noreferrer">
                        Ikuti Tautan
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className={styles.statusBadge}
                  style={{ backgroundColor: session.badgeColor }}
                >
                  {session.status}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </DashboardLayout>
  );
}