import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MyCoursePage.module.css";
import { useNavigate } from "react-router-dom";
import { Popup } from "@/components/Popup/Popup";

// Icons
import {
  FiCheck,
  FiX,
  FiClock,
  FiBookOpen,
  FiStar,
  FiCalendar,
  FiVideo,
  FiMessageCircle,
  FiMoreHorizontal,
  FiBell,
  FiPlayCircle,
  FiCheckCircle,
  FiSend,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";

import MyCourseCard from "@/components/MyCourseCard/MyCourseCard";

// Helper to match SearchPage aesthetics
const getCourseExtras = (category) => {
  const mapping = {
    programming: { color: "#38BDF8", emoji: "👩‍💻" },
    design: { color: "#FACC15", emoji: "🎨" },
    business: { color: "#F472B6", emoji: "⚙️" },
    Frontend: { color: "#38BDF8", emoji: "👩‍💻" },
    Backend: { color: "#F472B6", emoji: "⚙️" },
    "UI/UX Design": { color: "#FACC15", emoji: "🎨" },
    "Mobile Dev": { color: "#10B981", emoji: "📱" },
    "Data Science": { color: "#A78BFA", emoji: "📊" },
    Matematika: { color: "#FB923C", emoji: "📐" },
    "Bahasa Inggris": { color: "#6366F1", emoji: "🇬🇧" },
    "Bahasa Indonesia": { color: "#EF4444", emoji: "🇮🇩" },
    Fisika: { color: "#14B8A6", emoji: "⚛️" },
  };
  return mapping[category] || { color: "#94A3B8", emoji: "📚" };
};

// Dummy data for tabs not yet fully dynamic
const activeCourses = [
  {
    id: 101,
    name: "Michael Chen",
    role: "Mentor",
    topic: "Backend Node.js & Express",
    date: "Hari Ini",
    time: "19:00 WIB",
    emoji: "👲",
    color: "#F472B6",
    progress: 60,
    nextMeet: "Sesi 3 dari 5",
  },
];

const completedCourses = [
  {
    id: 201,
    name: "Amanda Smith",
    role: "Mentor",
    topic: "Figma Prototyping Lanjutan",
    date: "20 Okt 2026",
    time: "Selesai",
    emoji: "👱‍♀️",
    color: "#10B981",
    rating: 5,
    review: "Sangat membantu!",
  },
];

export default function MyCoursePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Kursus Saya");
  const [myCreatedCourses, setMyCreatedCourses] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const API_URL = "http://localhost:5001/api";

  const fetchMyCreatedCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses?tutorId=${user.id}`);

      const coursesArray = response.data.data;

      if (Array.isArray(coursesArray)) {
        setMyCreatedCourses(coursesArray);
      } else {
        console.error("Data yang diterima bukan array:", coursesArray);
        setMyCreatedCourses([]);
      }
    } catch (error) {
      console.error("Error fetching my courses:", error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      if (!user.id) return;
      const response = await fetch(
        `${API_URL}/bookings/student?studentId=${user.id}`,
      );
      const data = await response.json();
      setIncomingBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching my bookings:", error);
    }
  };
  const fetchIncomingBookings = async () => {
    try {
      if (!user.id) return;
      const response = await fetch(
        `${API_URL}/bookings/tutor?tutorId=${user.id}`,
      );
      const data = await response.json();
      setIncomingBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching incoming bookings:", error);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, tutorId: user.id }),
        },
      );
      const result = await response.json();
      if (response.ok) {
        setPopup({
          isOpen: true,
          type: "success",
          title: "Berhasil",
          description: result.message,
        });
        fetchIncomingBookings();
      } else {
        setPopup({
          isOpen: true,
          type: "danger",
          title: "Gagal",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Error",
        description: "Terjadi kesalahan koneksi.",
      });
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchMyCreatedCourses(),
        fetchMyBookings(),
        fetchIncomingBookings(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const tabs = [
    {
      id: "Kursus Saya",
      label: "Sesi Mentor Saya",
      icon: <FiUser />,
      count: myCreatedCourses.length,
    },
    {
      id: "Permintaan",
      label: "Permintaan Masuk",
      icon: <FiBell />,
      count: incomingBookings.length,
    },
    {
      id: "Pengajuan",
      label: "Pengajuan Saya",
      icon: <FiSend />,
      count: myBookings.length,
    },
    {
      id: "Selesai",
      label: "Riwayat Selesai",
      icon: <FiCheckCircle />,
      count: completedCourses.length,
    },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", bounce: 0.3 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
  };

  return (
    <DashboardLayout title="Kursus Saya">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className={styles.bookingBanner}>
          <div className={styles.bannerText}>
            <h2>Manajemen Kursus 👨🏻‍💻</h2>
            <p>
              Kelola semua pengajuan belajarmu, permintaan mengajar, jadwal
              aktif, dan riwayat di satu tempat.
            </p>
          </div>
          <button
            className={styles.findMentorBtn}
            onClick={() => navigate("/search")}
          >
            + Cari Mentor Baru
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={styles.badge}>{tab.count}</span>
              )}
            </button>
          ))}
        </motion.div>

        <div className={styles.tabContentArea}>
          <AnimatePresence mode="wait">
            {activeTab === "Kursus Saya" && (
              <motion.div
                key="kursus"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {loading ? (
                  <div className={styles.emptyState}>Memuat kursus...</div>
                ) : myCreatedCourses.length === 0 ? (
                  <div className={styles.emptyState}>
                    Anda belum membuat kursus apapun.
                  </div>
                ) : (
                  myCreatedCourses.map((course) => (
                    <MyCourseCard
                      key={course.id}
                      course={course}
                      onRefresh={fetchMyCreatedCourses}
                    />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "Pengajuan" && (
              <motion.div
                key="pengajuan"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {myBookings.length === 0 ? (
                  <div className={styles.emptyState}>
                    Kamu belum mengajukan kursus apapun.
                  </div>
                ) : (
                  myBookings.map((booking) => {
                    const extras = getCourseExtras(booking.course.kategori);
                    const dateObj = new Date(booking.scheduledAt);
                    return (
                      <div key={booking.id} className={styles.neoCard}>
                        <div className={styles.neoCardHeader}>
                          <div
                            className={styles.avatarWrap}
                            style={{ backgroundColor: extras.color }}
                          >
                            {extras.emoji}
                          </div>
                          <div className={styles.headerInfo}>
                            <h4>{booking.course.tutor}</h4>
                            <span>Mentor</span>
                          </div>
                          <div
                            className={styles.statusBadge}
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              padding: "4px 10px",
                              borderRadius: "10px",
                              backgroundColor:
                                booking.status === "ACCEPTED"
                                  ? "#dcfce7"
                                  : booking.status === "REJECTED"
                                    ? "#fee2e2"
                                    : "#fef9c3",
                              color:
                                booking.status === "ACCEPTED"
                                  ? "#16a34a"
                                  : booking.status === "REJECTED"
                                    ? "#ef4444"
                                    : "#ca8a04",
                            }}
                          >
                            {booking.status}
                          </div>
                        </div>
                        <div className={styles.cardBody}>
                          <h3 className={styles.topicTitle}>
                            <FiBookOpen /> {booking.course.name}
                          </h3>
                          <div className={styles.timeInfo}>
                            <div className={styles.timeBadge}>
                              <FiCalendar /> {dateObj.toLocaleDateString()}
                            </div>
                            <div className={styles.timeBadge}>
                              <FiClock />{" "}
                              {dateObj.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          {booking.note && (
                            <div className={styles.requestNote}>
                              <strong>Catatan:</strong> <p>"{booking.note}"</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.neoCardFooter}>
                          <button
                            className={`${styles.actionBtn} ${styles.btnChat}`}
                          >
                            <FiMessageCircle /> Chat Mentor
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "Permintaan" && (
              <motion.div
                key="permintaan"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {incomingBookings.length === 0 ? (
                  <div className={styles.emptyState}>
                    Belum ada permintaan masuk.
                  </div>
                ) : (
                  incomingBookings.map((booking) => {
                    const dateObj = new Date(booking.scheduledAt);
                    return (
                      <div key={booking.id} className={styles.neoCard}>
                        <div className={styles.neoCardHeader}>
                          <div
                            className={styles.avatarWrap}
                            style={{ backgroundColor: "#38BDF8" }}
                          >
                            <FiUser />
                          </div>
                          <div className={styles.headerInfo}>
                            <h4>{booking.studentName}</h4>
                            <span>Siswa</span>
                          </div>
                          {booking.status !== "PENDING" && (
                            <div
                              className={styles.statusBadge}
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                padding: "4px 10px",
                                borderRadius: "10px",
                                backgroundColor:
                                  booking.status === "ACCEPTED"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color:
                                  booking.status === "ACCEPTED"
                                    ? "#16a34a"
                                    : "#ef4444",
                              }}
                            >
                              {booking.status}
                            </div>
                          )}
                        </div>
                        <div className={styles.cardBody}>
                          <h3 className={styles.topicTitle}>
                            <FiBookOpen /> {booking.course.name}
                          </h3>
                          <div className={styles.timeInfo}>
                            <div className={styles.timeBadge}>
                              <FiCalendar /> {dateObj.toLocaleDateString()}
                            </div>
                            <div className={styles.timeBadge}>
                              <FiClock />{" "}
                              {dateObj.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className={styles.timeBadge}>
                              <FiPlayCircle /> {booking.course.durasi} Min
                            </div>
                          </div>
                          {booking.note && (
                            <div className={styles.requestNote}>
                              <strong>Catatan Siswa:</strong>{" "}
                              <p>"{booking.note}"</p>
                            </div>
                          )}
                        </div>
                        {booking.status === "PENDING" && (
                          <div className={styles.neoCardFooter}>
                            <button
                              className={`${styles.actionBtn} ${styles.btnDecline}`}
                              onClick={() =>
                                handleStatusUpdate(booking.id, "REJECTED")
                              }
                            >
                              <FiX /> Tolak
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.btnAccept}`}
                              onClick={() =>
                                handleStatusUpdate(booking.id, "ACCEPTED")
                              }
                            >
                              <FiCheck /> Terima
                            </button>
                          </div>
                        )}
                        {booking.status === "ACCEPTED" && (
                          <div className={styles.neoCardFooter}>
                            <button
                              className={`${styles.actionBtn} ${styles.btnChat}`}
                            >
                              <FiMessageCircle /> Chat Siswa
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === "Selesai" && (
              <motion.div
                key="selesai"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {completedCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`${styles.neoCard} ${styles.cardCompleted}`}
                  >
                    <div className={styles.neoCardHeader}>
                      <div
                        className={styles.avatarWrap}
                        style={{ backgroundColor: course.color }}
                      >
                        {course.emoji}
                      </div>
                      <div className={styles.headerInfo}>
                        <h4>{course.name}</h4>
                        <span>{course.role}</span>
                      </div>
                      <div className={styles.ratingBadge}>
                        <FiStar fill="#000" /> {course.rating}.0
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.topicTitle}>{course.topic}</h3>
                      <div className={styles.reviewBox}>"{course.review}"</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="OK"
        onAction={() => setPopup({ ...popup, isOpen: false })}
      />
    </DashboardLayout>
  );
}
