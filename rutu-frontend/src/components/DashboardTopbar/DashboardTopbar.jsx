import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./DashboardTopbar.module.css";
import { BsCheckAll } from "react-icons/bs";
import { CiLight } from "react-icons/ci";
import { Link } from "react-router-dom";
import {
  IoIosAddCircleOutline,
  IoIosNotificationsOutline,
} from "react-icons/io";
import { FaUser } from "react-icons/fa";
import {
  FiMessageSquare,
  FiCheckCircle,
  FiUserPlus,
  FiInfo,
  FiMenu,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA AWAL NOTIFIKASI ---
const initialNotifications = [
  {
    id: 1,
    type: "chat",
    title: "Pesan Baru",
    desc: "Grace membalas pesan Anda di grup Frontend.",
    time: "Baru saja",
    unread: true,
    icon: <FiMessageSquare />,
    color: "#38BDF8",
  },
  {
    id: 2,
    type: "status",
    title: "Pengajuan Diterima",
    desc: "Selamat! Pengajuan kursus 'React Lanjut' Anda telah disetujui admin.",
    time: "2 jam lalu",
    unread: true,
    icon: <FiCheckCircle />,
    color: "#10B981",
  },
  {
    id: 3,
    type: "request",
    title: "Permintaan Mentoring",
    desc: "Budi Santoso ingin menjadwalkan sesi 1-on-1 dengan Anda.",
    time: "Kemarin",
    unread: false,
    icon: <FiUserPlus />,
    color: "#FACC15",
  },
  {
    id: 4,
    type: "system",
    title: "Pembaruan Sistem",
    desc: "Fitur baru: Sertifikat kini tersedia untuk diunduh di profil Anda.",
    time: "2 hari lalu",
    unread: false,
    icon: <FiInfo />,
    color: "#A78BFA",
  },
];

export default function DashboardTopbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const userName = user?.name || "Pengguna";

  // --- State Notifikasi ---
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Klik di luar popup untuk menutup
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hitung jumlah yang belum dibaca
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Fungsi untuk menandai semua sudah dibaca
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, unread: false })),
    );
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <FiMenu />
        </button>
        <div className={styles.titleGroup}>
          <h1>{title}</h1>
        </div>
      </div>
      <div className={styles.navButtonsContainer}>
        <div className={styles.navItems}>
          {/* --- WRAPPER NOTIFIKASI --- */}
          <div className={styles.notifWrapper} ref={notifRef}>
            <div
              className={`${styles.navItem} ${isNotifOpen ? styles.navItemActive : ""}`}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              role="button"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IoIosNotificationsOutline
                style={{ width: "100%", height: "100%" }}
              />
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </div>

            {/* POPUP DROPDOWN NOTIFIKASI */}
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  className={styles.notifPopup}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
                >
                  <div className={styles.notifHeader}>
                    <h3>Notifikasi</h3>
                    {unreadCount > 0 && (
                      <span className={styles.unreadPill}>
                        {unreadCount} Baru
                      </span>
                    )}
                  </div>

                  {/* Area List dengan Max-Height & Scroll */}
                  <div className={styles.notifList}>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`${styles.notifItem} ${notif.unread ? styles.notifUnread : ""}`}
                      >
                        <div
                          className={styles.notifIconWrap}
                          style={{ backgroundColor: notif.color }}
                        >
                          {notif.icon}
                        </div>
                        <div className={styles.notifText}>
                          <h4>{notif.title}</h4>
                          <p>{notif.desc}</p>
                          <span className={styles.notifTime}>{notif.time}</span>
                        </div>
                        {notif.unread && (
                          <div className={styles.unreadDot}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.notifFooter}>
                    <button
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className={unreadCount === 0 ? styles.btnDisabled : ""}
                    >
                      <BsCheckAll size={20} /> Tandai sudah dibaca
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <IoIosAddCircleOutline className={styles.navItem} role="button" />
          <CiLight
            className={`${styles.navItem} ${styles.setThickness}`}
            role="button"
          />
        </div>

        <Link to="/profile" className={styles.profileBtn}>
          <div className={styles.avatar}>
            <FaUser className={styles.guestIcon} />
          </div>
          <span className={styles.userName}>{userName}</span>
        </Link>
      </div>
    </header>
  );
}
