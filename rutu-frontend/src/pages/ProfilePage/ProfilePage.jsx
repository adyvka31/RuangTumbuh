import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./ProfilePage.module.css";
import {
FiEdit3,
  FiMail,
  FiUser,
  FiLogOut,
  FiTrash2,
  FiMapPin,
  FiSettings,
  FiBookOpen,
  FiInfo,
  FiGift,
  FiClock,
  FiZap
} from "react-icons/fi";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Data User yang sudah dipersonalisasi
  const user = {
    name: "Adyvka Pratama",
    email: "rafifsava@example.com",
    role: "Siswa",
    location: "Indonesia",
    joined: "1 Januari 2024",
    birthday: "15 Agustus 2005",
    timeBalance: "120 Menit",
    school: "Universitas Muhammadiyah Jakarta",
    description:
      "Seorang pelajar yang antusias belajar teknologi web dan Artificial Intelligence. Saat ini fokus memperdalam React JS dan Flutter untuk membangun project sistem manajemen yang scalable.",
    passions: [
      "React JS",
      "Flutter",
      "Artificial Intelligence",
      "Web Development",
      "UI/UX Design",
    ],
    avatar: "🧔",
    stats: {
      learningHours: 120,
      teachingSessions: 15,
    },
  };

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

  return (
    <DashboardLayout title="Profil Saya">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* --- HERO PROFILE CARD --- */}
        <motion.div variants={itemVariants} className={styles.profileHeroCard}>
          <div className={styles.heroBanner}>
            <motion.button
              whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
              className={styles.editBtnBanner}
              onClick={() => navigate("/edit-profile")}
            >
              <FiEdit3 /> Edit Profil
            </motion.button>
          </div>

          <div className={styles.heroContent}>
            {/* Stat Kiri */}
            <div className={styles.sideStat}>
              <div
                className={styles.statBox}
                style={{ backgroundColor: "#facc15" }}
              >
                <span className={styles.statNumber}>
                  {user.stats.learningHours}
                </span>
                <span className={styles.statLabel}>Jam Belajar</span>
              </div>
            </div>

            {/* Profil Tengah */}
            <div className={styles.centerProfile}>
              <motion.div
                whileHover={{ rotate: -5, scale: 1.05 }}
                className={styles.avatarLarge}
              >
                {user.avatar}
              </motion.div>
              <h1 className={styles.userName}>{user.name}</h1>
              <div className={styles.userDetails}>
                <span className={styles.detailItem}>
                  <FiUser /> {user.role}
                </span>
                <span className={styles.detailDot}>•</span>
                <span className={styles.detailItem}>
                  <FiMapPin /> {user.location}
                </span>
                <span className={styles.detailDot}>•</span>
                <span className={styles.detailItem}>
                  <FiClock /> Bergabung {user.joined}
                </span>
              </div>
            </div>

            {/* Stat Kanan */}
            <div className={styles.sideStat}>
              <div
                className={styles.statBox}
                style={{ backgroundColor: "#4ade80" }}
              >
                <span className={styles.statNumber}>
                  {user.stats.teachingSessions}
                </span>
                <span className={styles.statLabel}>Sesi Selesai</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- BOTTOM GRID CONTENT --- */}
        <div className={styles.contentGrid}>
          {/* KOLOM KIRI: Informasi Akademik & Bio */}
          <div className={styles.leftColumn}>
            <motion.div variants={itemVariants} className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FiInfo
                  className={styles.cardIcon}
                  style={{ color: "#38bdf8" }}
                />
                <h2 className={styles.cardTitle}>Tentang Saya</h2>
              </div>

              <div className={styles.bioContent}>
                {/* 1. Teks Deskripsi Diri */}
                <p className={styles.descriptionText}>{user.description}</p>

                {/* 3. List Informasi Tambahan */}
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <div
                      className={styles.infoItemIcon}
                      style={{ backgroundColor: "var(--primary-green)" }}
                    >
                      <FiGift />
                    </div>
                    <div className={styles.infoItemText}>
                      <p className={styles.infoLabel}>Tanggal Lahir</p>
                      <p className={styles.infoValue}>{user.birthday}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div
                      className={styles.infoItemIcon}
                      style={{ backgroundColor: "var(--primary-yellow)" }}
                    >
                      <FiMail />
                    </div>
                    <div className={styles.infoItemText}>
                      <p className={styles.infoLabel}>Kontak Email</p>
                      <p className={styles.infoValue}>{user.email}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div
                      className={styles.infoItemIcon}
                      style={{ backgroundColor: "var(--primary-blue)" }}
                    >
                      <FiBookOpen />
                    </div>
                    <div className={styles.infoItemText}>
                      <p className={styles.infoLabel}>
                        Asal Sekolah / Institusi
                      </p>
                      <p className={styles.infoValue}>{user.school}</p>
                    </div>
                  </div>
                </div>
                {/* 2. Card Sub-Section untuk Passion */}
                <div className={styles.passionSection}>
                  <h3 className={styles.subTitle}>Keahlian & Minat</h3>
                  <div className={styles.passionWrapper}>
                    {user.passions.map((item, index) => (
                      <span key={index} className={styles.passionTag}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* KOLOM KANAN: Settings */}
          <div className={styles.rightColumn}>
            {/* CARD 1: Saldo Waktu */}
            <motion.div variants={itemVariants} className={styles.balanceCard}>
              <div className={styles.cardHeader}>
                <FiClock
                  className={styles.cardIcon}
                  style={{ color: "#10b981" }}
                />
                <h2 className={styles.cardTitle}>Saldo Waktu</h2>
              </div>
              <div className={styles.balanceContent}>
                <h2 className={styles.balanceValue}>{user.timeBalance}</h2>
                <p className={styles.balanceSub}>
                  Tersedia untuk pendaftaran kelas
                </p>
                <motion.button
                  whileHover={{ y: -3, boxShadow: "7px 7px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={styles.topUpBtn}
                >
                  <FiZap /> Isi Saldo ⚡
                </motion.button>
              </div>
            </motion.div>

            {/* CARD 2: Pengaturan */}
            <motion.div variants={itemVariants} className={styles.actionCard}>
              <div className={styles.cardHeader}>
                <FiSettings
                  className={styles.cardIcon}
                  style={{ color: "#a1a1aa" }}
                />
                <h2 className={styles.cardTitle}>Pengaturan Akun</h2>
              </div>
              <div className={styles.actionList}>
                <p className={styles.actionDesc}>
                  Kelola keamanan atau keluar dari sesi aktif Anda saat ini.
                </p>
                <motion.button
                  whileHover={{ y: -3, boxShadow: "7px 7px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={`${styles.actionBtn} ${styles.logoutBtn}`}
                  onClick={() => navigate("/login")}
                >
                  <FiLogOut /> Keluar Akun
                </motion.button>
                <motion.button
                  whileHover={{ y: -3, boxShadow: "7px 7px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                >
                  <FiTrash2 /> Hapus Akun Permanen
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
