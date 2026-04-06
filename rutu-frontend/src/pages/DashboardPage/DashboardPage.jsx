import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";

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
  const { user } = useAuth();

  const userName = user ? user.name : "Pengguna";
  const firstName = userName.split(" ")[0];

  const [dbStats, setDbStats] = useState({
    timeBalance: 0,
    learningMinutes: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    mentoringSessions: [],
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(
          `http://localhost:5001/api/users/${user?.id}/dashboard`,
        );
        if (response.ok) {
          const data = await response.json();
          setDbStats({
            timeBalance: data.timeBalance || 0,
            learningMinutes: data.learningMinutes || 0,
            upcomingSessions: data.upcomingSessions || 0,
            completedSessions: data.completedSessions || 0,
            mentoringSessions: data.mentoringSessions || [], // <-- Ambil data dari backend
          });
        }
      } catch (error) {
        console.error("Gagal memuat statistik dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fungsi untuk memformat tanggal database menjadi teks yang rapi
  const formatScheduleTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  // Daftar tema warna agar list jadwal berwarna-warni
  const colorThemes = [
    { bg: "var(--primary-yellow)", badge: "#fde68a" },
    { bg: "var(--primary-blue)", badge: "#bfdbfe" },
    { bg: "var(--primary-green)", badge: "#86efac" }, // Hijau lembut
  ];

  // Mapping data stat kotak-kotak
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
        <motion.section variants={itemVariants} className={styles.banner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>
              Halo, {firstName}{" "}
              <span className={styles.waveEmoji} role="img" aria-label="wave">
                👋
              </span>
            </h2>
            <p className={styles.bannerSub}>
              Siap untuk belajar, berkembang, dan menjelajah hari ini?
            </p>
            <div className={styles.bannerButtons}>
              <button
                className={styles.bannerBtn}
                onClick={() => navigate("/search")}
              >
                <FiBook /> Mulai Belajar{" "}
                <div className={styles.bannerBtnArrow}></div>
              </button>
              <button
                className={`${styles.bannerBtn} ${styles.btnSecondary}`}
                onClick={() => navigate("/add-course")}
              >
                <FiVideo /> Buka Sesi Mengajar{" "}
                <div className={styles.bannerBtnArrow}>˃</div>
              </button>
            </div>
          </div>
          <div className={styles.bannerDecor}>
            {[shape10, shape11, shape12, shape13].map((shape, i) => (
              <motion.img
                key={i}
                animate={{ y: [0, -(10 + i * 3), 0], rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                src={shape}
                alt="Dekorasi"
                className={styles.mascot}
              />
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className={styles.statsGrid}>
          {stats.map((card, idx) => (
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
                <h3 className={styles.emptyStateTitle}>Belum Ada Jadwal</h3>
                <p className={styles.emptyStateDesc}>
                  Anda belum memiliki jadwal kelas atau sesi mentoring yang akan
                  datang. Yuk, cari dan daftar kelas sekarang!
                </p>
              </div>
            ) : (
              dbStats.mentoringSessions.map((session, index) => {
                // Ambil warna tema secara berurutan
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
                          <span className={styles.itemTime}>
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
