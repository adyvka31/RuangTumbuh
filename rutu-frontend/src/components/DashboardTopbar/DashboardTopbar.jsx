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
  FiInfo,
  FiMenu,
  FiBookOpen,
  FiCalendar,
  FiInbox,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications"; //

// Mapping icon & color tetap sama dengan style awal website Anda
const getIconAndColor = (type) => {
  switch (type) {
    case "COURSE_CREATED":
      return { icon: <FiBookOpen />, color: "#A78BFA" };
    case "SCHEDULE_CREATED":
      return { icon: <FiCalendar />, color: "#38BDF8" };
    case "BOOKING_NEW":
      return { icon: <FiInbox />, color: "#FACC15" };
    case "BOOKING_STATUS":
      return { icon: <FiInfo />, color: "#FB923C" };
    case "BOOKING_COMPLETED":
      return { icon: <FiCheckCircle />, color: "#10B981" };
    default:
      return { icon: <FiMessageSquare />, color: "#38BDF8" };
  }
};

export default function DashboardTopbar({ title, onMenuClick }) {
  const { user } = useAuth(); //
  const userName = user?.name || "Pengguna";

  // --- Mengambil Data Real dari Hook ---
  const { notifications, loading } = useNotifications(); //
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hitung jumlah yang belum dibaca (asumsi field 'unread' atau '!isRead' dari backend)
  const unreadCount = notifications.filter((n) => n.unread || !n.isRead).length;

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
                style={{ width: "100%", height: "100%", strokeWidth: 10 }}
              />
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </div>

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

                  <div className={styles.notifList}>
                    {loading ? (
                      <p
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        Memuat...
                      </p>
                    ) : notifications.length > 0 ? (
                      notifications.map((notif) => {
                        const theme = getIconAndColor(notif.type);
                        return (
                          <div
                            key={notif.id}
                            className={`${styles.notifItem} ${notif.unread || !notif.isRead ? styles.notifUnread : ""}`}
                          >
                            <div
                              className={styles.notifIconWrap}
                              style={{ backgroundColor: theme.color }}
                            >
                              {theme.icon}
                            </div>
                            <div className={styles.notifText}>
                              <h4>{notif.title}</h4>
                              <p>{notif.message || notif.desc}</p>
                              <span className={styles.notifTime}>
                                {new Date(notif.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                            {(notif.unread || !notif.isRead) && (
                              <div className={styles.unreadDot}></div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        Tidak ada notifikasi baru.
                      </p>
                    )}
                  </div>

                  <div className={styles.notifFooter}>
                    <button
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
