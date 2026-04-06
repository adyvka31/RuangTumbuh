import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./ProfilePage.module.css";
import {
  FiEdit3,
  FiMail,
  FiUser,
  FiMapPin,
  FiBookOpen,
  FiInfo,
  FiCalendar,
  FiClock,
  FiZap,
} from "react-icons/fi";

export default function ProfilePage() {
  const { user: localUser, logout } = useAuth();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    passions: [],
    stats: { learningMinutes: 0, teachingSessions: 0 },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!localUser.id) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5001/api/users/${localUser.id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false); // 2. PERBAIKAN: Matikan loading di blok finally
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum diatur";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 3. PERBAIKAN: Gunakan Optional Chaining (?.) agar tidak crash jika name belum ada
  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

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

  // 4. PERBAIKAN: Hilangkan interupsi loading screen.
  // Langsung return layout utamanya saja.
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
              whileTap={{ scale: 0.95 }}
              className={styles.editBtnBanner}
              onClick={() => navigate("/edit-profile")}
            >
              <FiEdit3 /> Edit Profil
            </motion.button>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.sideStat}>
              <div
                className={styles.statBox}
                style={{ backgroundColor: "var(--primary-blue)" }}
              >
                <span className={styles.statNumber}>
                  {userProfile?.stats?.learningMinutes || 0}
                </span>
                <span className={styles.statLabel}>Menit Belajar</span>
              </div>
            </div>

            <div className={styles.centerProfile}>
              <div
                className={styles.avatarLarge}
                style={{ overflow: "hidden" }}
              >
                {userProfile?.profilePicture ? (
                  <img
                    src={`http://localhost:5001${userProfile.profilePicture}`}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <h1 className={styles.userName}>
                {userProfile?.name || "Memuat..."}
              </h1>
              <div className={styles.userDetails}>
                <span className={styles.detailItem}>
                  <FiUser /> Siswa
                </span>
                <span className={styles.detailDot}>•</span>
                <span className={styles.detailItem}>
                  <FiMapPin /> {userProfile?.location || "Belum diatur"}
                </span>
                <span className={styles.detailDot}>•</span>
                <span className={styles.detailItem}>
                  <FiCalendar /> Bergabung Pada{" "}
                  {formatDate(userProfile?.createdAt)}
                </span>
              </div>
            </div>

            <div className={styles.sideStat}>
              <div
                className={styles.statBox}
                style={{ backgroundColor: "var(--primary-green)" }}
              >
                <span className={styles.statNumber}>
                  {userProfile?.stats?.teachingSessions || 0}
                </span>
                <span className={styles.statLabel}>Sesi Mengajar</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- BOTTOM GRID CONTENT --- */}
        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <motion.div variants={itemVariants} className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <FiInfo
                  className={styles.cardIcon}
                  style={{ color: "var(--primary-blue)" }}
                />
                <h2 className={styles.cardTitle}>Tentang Saya</h2>
              </div>
              <div className={styles.bioContent}>
                <p className={styles.descriptionText}>
                  {userProfile?.description ||
                    "Halo! Saya belum menuliskan deskripsi diri."}
                </p>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <div
                      className={styles.infoItemIcon}
                      style={{ backgroundColor: "var(--primary-yellow)" }}
                    >
                      <FiMail />
                    </div>
                    <div className={styles.infoItemText}>
                      <p className={styles.infoLabel}>Kontak Email</p>
                      <p className={styles.infoValue}>
                        {userProfile?.email || "..."}
                      </p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div
                      className={styles.infoItemIcon}
                      style={{ backgroundColor: "var(--primary-red)" }}
                    >
                      <FiBookOpen />
                    </div>
                    <div className={styles.infoItemText}>
                      <p className={styles.infoLabel}>Asal Sekolah</p>
                      <p className={styles.infoValue}>
                        {userProfile?.school || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.passionSection}>
                  <h3 className={styles.subTitle}>Keahlian & Minat</h3>
                  <div className={styles.passionWrapper}>
                    {userProfile?.passions?.length > 0 ? (
                      userProfile.passions.map((item, index) => (
                        <span key={index} className={styles.passionTag}>
                          {item}
                        </span>
                      ))
                    ) : (
                      <span
                        className={styles.passionTag}
                        style={{ backgroundColor: "#e5e7eb", color: "#666" }}
                      >
                        Belum ada minat.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className={styles.rightColumn}>
            <motion.div variants={itemVariants} className={styles.balanceCard}>
              <div className={styles.cardHeader}>
                <FiClock
                  className={styles.cardIcon}
                  style={{ color: "var(--primary-green)" }}
                />
                <h2 className={styles.cardTitle}>Saldo Waktu</h2>
              </div>
              <div className={styles.balanceContent}>
                <h2 className={styles.balanceValue}>
                  {userProfile?.timeBalance || 0} Menit
                </h2>
                <p className={styles.balanceSub}>Tersedia untuk kelas</p>
                <motion.button
                  className={styles.topUpBtn}
                  onClick={() => navigate("/help")}
                >
                  <FiZap /> Isi Saldo ⚡
                </motion.button>
              </div>
            </motion.div>
            {/* Action Card tetap sama */}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
