import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./ProfilePage.module.css";
import {
  FiEdit3,
  FiMail,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiTrash2,
  FiActivity,
  FiAward,
  FiSettings,
} from "react-icons/fi";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Dummy Data - Diperluas agar UI terlihat lebih premium
  const user = {
    name: "Alyssa Jane",
    email: "alyssa.jane@example.com",
    role: "Learning Explorer",
    joined: "March 2026",
    avatar: "AJ",
    stats: {
      coursesCompleted: 12,
      learningHours: 120,
    },
  };

  // Variasi animasi untuk container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
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
          <div className={styles.heroLeft}>
            <motion.div
              whileHover={{ rotate: -5, scale: 1.05 }}
              className={styles.avatarContainer}
            >
              <div className={styles.avatarLarge}>{user.avatar}</div>
            </motion.div>

            <div className={styles.headerInfo}>
              <h1 className={styles.userName}>{user.name}</h1>
              <span className={styles.roleBadge}>{user.role}</span>

              <div className={styles.quickStats}>
                <div className={styles.statItem}>
                  <FiAward className={styles.statIcon} />
                  <span>{user.stats.coursesCompleted} Kelas Selesai</span>
                </div>
                <div className={styles.statItem}>
                  <FiActivity className={styles.statIcon} />
                  <span>{user.stats.learningHours} Jam Belajar</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <motion.button
              whileHover={{ y: -4, boxShadow: "8px 8px 0px #000" }}
              whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
              className={styles.editBtn}
              onClick={() => navigate("/edit-profile")}
            >
              <FiEdit3 style={{ fontSize: "1.2rem" }} /> Edit Profil
            </motion.button>
          </div>
        </motion.div>

        {/* --- BOTTOM GRID SPLIT --- */}
        <div className={styles.contentGrid}>
          {/* KOLOM KIRI: Informasi Detail */}
          <motion.div variants={itemVariants} className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <FiUser
                className={styles.cardIcon}
                style={{ color: "#38bdf8" }}
              />
              <h2 className={styles.cardTitle}>Informasi Akun</h2>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div
                  className={styles.infoItemIcon}
                  style={{ backgroundColor: "#facc15" }}
                >
                  <FiMail />
                </div>
                <div className={styles.infoItemText}>
                  <p className={styles.infoLabel}>Alamat Email</p>
                  <p className={styles.infoValue}>{user.email}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div
                  className={styles.infoItemIcon}
                  style={{ backgroundColor: "#a78bfa" }}
                >
                  <FiCalendar />
                </div>
                <div className={styles.infoItemText}>
                  <p className={styles.infoLabel}>Bergabung Sejak</p>
                  <p className={styles.infoValue}>{user.joined}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* KOLOM KANAN: Settings & Danger Zone */}
          <motion.div variants={itemVariants} className={styles.actionCard}>
            <div className={styles.cardHeader}>
              <FiSettings
                className={styles.cardIcon}
                style={{ color: "#a1a1aa" }}
              />
              <h2 className={styles.cardTitle}>Pengaturan Sistem</h2>
            </div>

            <div className={styles.actionList}>
              <p
                style={{
                  fontWeight: 600,
                  color: "#666",
                  marginBottom: "10px",
                  lineHeight: 1.5,
                }}
              >
                Kelola sesi aktif Anda atau hapus data akun secara permanen dari
                sistem kami.
              </p>

              <motion.button
                whileHover={{ y: -3, boxShadow: "7px 7px 0px #000" }}
                whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                className={`${styles.actionBtn} ${styles.logoutBtn}`}
                onClick={() => navigate("/login")}
              >
                <FiLogOut style={{ fontSize: "1.3rem" }} /> Keluar Akun
              </motion.button>

              <motion.button
                whileHover={{ y: -3, boxShadow: "7px 7px 0px #000" }}
                whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
              >
                <FiTrash2 style={{ fontSize: "1.3rem" }} /> Hapus Akun Permanen
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
