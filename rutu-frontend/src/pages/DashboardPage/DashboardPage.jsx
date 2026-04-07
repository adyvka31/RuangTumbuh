import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./DashboardPage.module.css";
import { useDashboard } from "@/hooks/useDashboard";
import {
  FiClock,
  FiVideo,
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { RiWalletLine } from "react-icons/ri";

import shape10 from "@/assets/shape10.svg";
import shape11 from "@/assets/shape11.svg";
import shape12 from "@/assets/shape12.svg";
import shape13 from "@/assets/shape13.svg";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    firstName,
    dbStats,
    isPending,
    isError,
    formatScheduleTime,
    colorThemes,
  } = useDashboard();

  // Konfigurasi Animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (isPending)
    return (
      <DashboardLayout title="Dashboard">
        <div className={styles.loading}>Memuat dashboard...</div>
      </DashboardLayout>
    );

  if (isError || !dbStats)
    return (
      <DashboardLayout title="Dashboard">
        <div className={styles.errorWrapper}>
          <h3>Terjadi Kesalahan Server (500)</h3>
          <p>
            Gagal memuat data statistik dashboard. Silakan cek terminal backend.
          </p>
        </div>
      </DashboardLayout>
    );

  const stats = [
    {
      label: "Dompet Waktu",
      value: `${dbStats.timeBalance} Menit`,
      icon: <RiWalletLine />,
      color: "var(--primary-blue)",
    },
    {
      label: "Durasi Belajar",
      value: `${dbStats.learningMinutes} Menit`,
      icon: <FiBookOpen />,
      color: "var(--primary-green)",
    },
    {
      label: "Sesi Mendatang",
      value: dbStats.upcomingSessions.toString(),
      icon: <FiCalendar />,
      color: "var(--primary-yellow)",
    },
    {
      label: "Sesi Selesai",
      value: dbStats.completedSessions.toString(),
      icon: <FiCheckCircle />,
      color: "#a78bfa",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <motion.div
        className={styles.contentFlex}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* BANNER UTAMA */}
        <motion.section variants={itemVariants} className={styles.banner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>
              Halo, {firstName} <span className={styles.waveEmoji}>👋</span>
            </h2>
            <p className={styles.bannerSub}>
              Siap untuk belajar, berkembang, dan menjelajah hari ini?
            </p>
            <div className={styles.bannerButtons}>
              <button
                className={styles.bannerBtn}
                onClick={() => navigate("/search")}
              >
                <FiBook /> Mulai Belajar
              </button>
              <button
                className={`${styles.bannerBtn} ${styles.btnSecondary}`}
                onClick={() => navigate("/add-course")}
              >
                <FiVideo /> Buka Sesi Mengajar
              </button>
            </div>
          </div>
          <div className={styles.bannerDecor}>
            {[shape10, shape11, shape12, shape13].map((shape, i) => (
              <motion.img
                key={i}
                animate={{ y: [0, -(10 + i * 3), 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4 + i * 0.5, repeat: Infinity }}
                src={shape}
                className={styles.mascot}
              />
            ))}
          </div>
        </motion.section>

        {/* STATS CARDS */}
        <motion.section variants={itemVariants} className={styles.statsGrid}>
          {stats.map((card, idx) => (
            <div
              key={idx}
              className={styles.statCard}
              style={{ backgroundColor: card.color }}
            >
              <div className={styles.statHeader}>
                <span>{card.label}</span>
                {card.icon}
              </div>
              <div className={styles.statValue}>{card.value}</div>
            </div>
          ))}
        </motion.section>

        {/* MENTORING SESSIONS LIST */}
        <motion.section
          variants={itemVariants}
          className={styles.mentoringSection}
        >
          <div className={styles.sectionHeader}>
            <h2>Sesi Mentoring Anda</h2>
            <span
              className={styles.seeAll}
              onClick={() => navigate("/schedule")}
            >
              Lihat Semua
            </span>
          </div>

          <div className={styles.mentoringList}>
            {dbStats.mentoringSessions.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Belum Ada Jadwal</h3>
                <p>Cari dan daftar kelas sekarang!</p>
              </div>
            ) : (
              dbStats.mentoringSessions.map((session, index) => {
                const theme = colorThemes[index % colorThemes.length];
                return (
                  <div
                    key={session.id}
                    className={styles.mentoringItem}
                    style={{ backgroundColor: theme.bg }}
                  >
                    <div className={styles.itemContent}>
                      <div className={styles.itemIcon}>
                        <FiVideo size={28} />
                      </div>
                      <div className={styles.itemText}>
                        <span className={styles.itemTitle}>
                          {session.title}
                        </span>
                        <div className={styles.itemMeta}>
                          <span>
                            <FiClock /> {formatScheduleTime(session.time)}
                          </span>
                          <a
                            href={session.url}
                            className={styles.itemUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ikuti Tautan
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      className={styles.statusBadge}
                      style={{ backgroundColor: theme.badge }}
                    >
                      {session.status}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.section>
      </motion.div>
    </DashboardLayout>
  );
}
