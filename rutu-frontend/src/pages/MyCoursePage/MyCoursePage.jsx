import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MyCoursePage.module.css";
import { useNavigate } from "react-router-dom";

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
  FiEye,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";

// --- DUMMY DATA ---
// 1. Pengajuan yang dilakukan User ke Mentor
const myRequests = [
  {
    id: 301,
    mentorName: "Budi Santoso",
    topic: "Fullstack Laravel & Vue",
    date: "Hari Ini",
    time: "10:30 WIB",
    emoji: "👨‍💻",
    color: "#FBBF24",
    status: "Diajukan",
  },
  {
    id: 302,
    mentorName: "Siti Aminah",
    topic: "UI/UX Research Fundamental",
    date: "Kemarin",
    time: "15:00 WIB",
    emoji: "👩‍🎨",
    color: "#A78BFA",
    status: "Ditinjau",
  },
  {
    id: 303,
    mentorName: "John Doe",
    topic: "DevOps & AWS Basic",
    date: "3 Hari Lalu",
    time: "09:00 WIB",
    emoji: "🧔",
    color: "#F87171",
    status: "Ditolak",
  },
];

// 2. Permintaan dari Siswa lain ke User (Jika User adalah Mentor)
const mentorRequests = [
  {
    id: 1,
    name: "Alexander Pierce",
    role: "Siswa",
    topic: "React Development Dasar",
    date: "12 Nov 2026",
    time: "14:00 WIB",
    sessions: "4 Sesi",
    duration: "90 Menit",
    note: "Halo kak, saya ingin fokus belajar React Hooks dari awal karena sering bingung di bagian useEffect.",
    emoji: "👦",
    color: "#38BDF8",
  },
  {
    id: 2,
    name: "Siti Aminah",
    role: "Siswa",
    topic: "Review Portfolio UI/UX",
    date: "15 Nov 2026",
    time: "19:30 WIB",
    sessions: "1 Sesi",
    duration: "60 Menit",
    note: "Mohon bantuannya untuk review portfolio saya sebelum apply magang besok ya kak.",
    emoji: "👩‍🎨",
    color: "#A78BFA",
  },
];

// 3. Kursus yang Sedang Berjalan
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

// 4. Kursus yang Sudah Selesai
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

export default function BookingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Kursus Saya"); // Tab default

  const tabs = [
    {
      id: "Kursus Saya",
      label: "Kursus Saya",
      icon: <FiUser />,
      count: myRequests.length,
    },
    {
      id: "Pengajuan",
      label: "Pengajuan Saya",
      icon: <FiSend />,
      count: myRequests.length,
    },
    {
      id: "Permintaan",
      label: "Permintaan Masuk",
      icon: <FiBell />,
      count: mentorRequests.length,
    },
    {
      id: "Berlangsung",
      label: "Sedang Berlangsung",
      icon: <FiPlayCircle />,
      count: activeCourses.length,
    },
    {
      id: "Selesai",
      label: "Riwayat Selesai",
      icon: <FiCheckCircle />,
      count: completedCourses.length,
    },
  ];

  // Konfigurasi animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
  };
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, type: "spring", bounce: 0.3 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <DashboardLayout title="Kursus Saya">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* --- BANNER --- */}
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

        {/* --- TABS NAVIGATION --- */}
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

        {/* --- KONTEN TAB --- */}
        <div className={styles.tabContentArea}>
          <AnimatePresence mode="wait">

            {/* 1. TAB PENGAJUAN SAYA (User melamar ke Mentor) */}
            {activeTab === "Kursus Saya" && (
              <motion.div
                key="kursus"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {myRequests.length === 0 ? (
                  <div className={styles.emptyState}>
                    Kamu belum mengajukan kursus ke mentor manapun.
                  </div>
                ) : (
                  myRequests.map((req) => (
                    <div key={req.id} className={styles.neoCard}>
                      <div className={styles.neoCardHeader}>
                        <div
                          className={styles.avatarWrap}
                          style={{ backgroundColor: req.color }}
                        >
                          {req.emoji}
                        </div>
                        <div className={styles.headerInfo}>
                          <h4>{req.mentorName}</h4>
                          <span>Mentor</span>
                        </div>
                        <button className={styles.iconBtn}>
                          <FiMoreHorizontal />
                        </button>
                      </div>

                      <div className={styles.cardBody}>
                        <h3 className={styles.topicTitle}>
                          <FiBookOpen /> {req.topic}
                        </h3>
                        <div className={styles.timeInfo}>
                          <div className={styles.timeBadge}>
                            <FiCalendar /> {req.date}
                          </div>
                          <div className={styles.timeBadge}>
                            <FiClock /> {req.time}
                          </div>
                        </div>

                        {/* MINI STATUS TRACKER */}
                        <div className={styles.miniTracker}>
                          <div className={styles.miniStep}>
                            <div
                              className={`${styles.miniCircle} ${styles.circleDone}`}
                            >
                              <FiCheck />
                            </div>
                            <span>Diajukan</span>
                          </div>
                          <div
                            className={`${styles.miniLine} ${req.status !== "Diajukan" ? styles.lineActive : ""}`}
                          ></div>
                          <div className={styles.miniStep}>
                            <div
                              className={`${styles.miniCircle} ${req.status === "Ditinjau" ? styles.circleReview : req.status === "Ditolak" ? styles.circleDone : ""}`}
                            >
                              {req.status === "Ditinjau" ? (
                                <FiEye />
                              ) : req.status === "Diajukan" ? (
                                <FiClock />
                              ) : (
                                <FiCheck />
                              )}
                            </div>
                            <span>Ditinjau</span>
                          </div>
                          <div
                            className={`${styles.miniLine} ${req.status === "Ditolak" ? styles.lineReject : ""}`}
                          ></div>
                          <div className={styles.miniStep}>
                            <div
                              className={`${styles.miniCircle} ${req.status === "Ditolak" ? styles.circleReject : ""}`}
                            >
                              {req.status === "Ditolak" ? (
                                <FiX />
                              ) : (
                                <FiAlertCircle />
                              )}
                            </div>
                            <span>Keputusan</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.neoCardFooter}>
                        <button
                          className={`${styles.actionBtn} ${styles.btnChat}`}
                        >
                          <FiMessageCircle /> Chat Mentor
                        </button>
                        {req.status === "Ditolak" && (
                          <button
                            className={`${styles.actionBtn} ${styles.btnSecondary}`}
                          >
                            Cari Lain
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* 1. TAB PENGAJUAN SAYA (User melamar ke Mentor) */}
            {activeTab === "Pengajuan" && (
              <motion.div
                key="pengajuan"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {myRequests.length === 0 ? (
                  <div className={styles.emptyState}>
                    Kamu belum mengajukan kursus ke mentor manapun.
                  </div>
                ) : (
                  myRequests.map((req) => (
                    <div key={req.id} className={styles.neoCard}>
                      <div className={styles.neoCardHeader}>
                        <div
                          className={styles.avatarWrap}
                          style={{ backgroundColor: req.color }}
                        >
                          {req.emoji}
                        </div>
                        <div className={styles.headerInfo}>
                          <h4>{req.mentorName}</h4>
                          <span>Mentor</span>
                        </div>
                        <button className={styles.iconBtn}>
                          <FiMoreHorizontal />
                        </button>
                      </div>

                      <div className={styles.cardBody}>
                        <h3 className={styles.topicTitle}>
                          <FiBookOpen /> {req.topic}
                        </h3>
                        <div className={styles.timeInfo}>
                          <div className={styles.timeBadge}>
                            <FiCalendar /> {req.date}
                          </div>
                          <div className={styles.timeBadge}>
                            <FiClock /> {req.time}
                          </div>
                        </div>

                        {/* MINI STATUS TRACKER */}
                        <div className={styles.miniTracker}>
                          <div className={styles.miniStep}>
                            <div
                              className={`${styles.miniCircle} ${styles.circleDone}`}
                            >
                              <FiCheck />
                            </div>
                            <span>Diajukan</span>
                          </div>
                          <div
                            className={`${styles.miniLine} ${req.status !== "Diajukan" ? styles.lineActive : ""}`}
                          ></div>
                          <div className={styles.miniStep}>
                            <div
                              className={`${styles.miniCircle} ${req.status === "Ditinjau" ? styles.circleReview : req.status === "Ditolak" ? styles.circleDone : ""}`}
                            >
                              {req.status === "Ditinjau" ? (
                                <FiEye />
                              ) : req.status === "Diajukan" ? (
                                <FiClock />
                              ) : (
                                <FiCheck />
                              )}
                            </div>
                            <span>Ditinjau</span>
                          </div>
                          <div
                            className={`${styles.miniLine} ${req.status === "Ditolak" ? styles.lineReject : ""}`}
                          ></div>
                          <div className={styles.miniStep}>
                            <div
                              className={`${styles.miniCircle} ${req.status === "Ditolak" ? styles.circleReject : ""}`}
                            >
                              {req.status === "Ditolak" ? (
                                <FiX />
                              ) : (
                                <FiAlertCircle />
                              )}
                            </div>
                            <span>Keputusan</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.neoCardFooter}>
                        <button
                          className={`${styles.actionBtn} ${styles.btnChat}`}
                        >
                          <FiMessageCircle /> Chat Mentor
                        </button>
                        {req.status === "Ditolak" && (
                          <button
                            className={`${styles.actionBtn} ${styles.btnSecondary}`}
                          >
                            Cari Lain
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* 2. TAB PERMINTAAN MASUK */}
            {activeTab === "Permintaan" && (
              <motion.div
                key="permintaan"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {mentorRequests.length === 0 ? (
                  <div className={styles.emptyState}>
                    Belum ada permintaan masuk.
                  </div>
                ) : (
                  mentorRequests.map((req) => (
                    <div key={req.id} className={styles.neoCard}>
                      <div className={styles.neoCardHeader}>
                        <div
                          className={styles.avatarWrap}
                          style={{ backgroundColor: req.color }}
                        >
                          {req.emoji}
                        </div>
                        <div className={styles.headerInfo}>
                          <h4>{req.name}</h4>
                          <span>{req.role}</span>
                        </div>
                      </div>

                      {/* --- BAGIAN BODY YANG DIPERBARUI --- */}
                      <div className={styles.cardBody}>
                        <h3 className={styles.topicTitle}>
                          <FiBookOpen /> {req.topic}
                        </h3>

                        {/* 1. Baris Waktu, Sesi, dan Durasi */}
                        <div className={styles.timeInfo}>
                          <div className={styles.timeBadge}>
                            <FiCalendar /> {req.date}
                          </div>
                          <div className={styles.timeBadge}>
                            <FiClock /> {req.time}
                          </div>
                          <div className={styles.timeBadge}>
                            <FiPlayCircle /> {req.sessions}
                          </div>
                          {/* Opsional: Jika ingin menampilkan durasi juga */}
                          <div className={styles.timeBadge}>
                            <FiClock /> {req.duration}
                          </div>
                        </div>

                        {/* 2. Catatan Siswa (Pengganti Tag) */}
                        <div className={styles.requestNote}>
                          <strong>Catatan Siswa:</strong>
                          <p>"{req.note}"</p>
                        </div>
                      </div>
                      {/* ---------------------------------- */}

                      <div className={styles.neoCardFooter}>
                        <button
                          className={`${styles.actionBtn} ${styles.btnDecline}`}
                        >
                          <FiX /> Tolak
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.btnAccept}`}
                        >
                          <FiCheck /> Terima
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* 3. TAB SEDANG BERLANGSUNG */}
            {activeTab === "Berlangsung" && (
              <motion.div
                key="berlangsung"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {activeCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`${styles.neoCard} ${styles.cardActive}`}
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
                      <div className={styles.statusLive}>ONGOING</div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.topicTitle}>{course.topic}</h3>
                      <div className={styles.progressSection}>
                        <div className={styles.progressText}>
                          <span>Progres Belajar</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div
                            className={styles.progressBarFill}
                            style={{
                              width: `${course.progress}%`,
                              backgroundColor: course.color,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className={styles.nextMeet}>
                        <FiVideo /> <strong>Terdekat:</strong> {course.date},{" "}
                        {course.time}
                      </div>
                    </div>
                    <div className={styles.neoCardFooter}>
                      <button
                        className={`${styles.actionBtn} ${styles.btnChat}`}
                      >
                        <FiMessageCircle /> Chat
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.btnJoin}`}
                        onClick={() => navigate("/presence")}
                      >
                        Masuk Kelas
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 4. TAB RIWAYAT SELESAI */}
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
                    <div className={styles.neoCardFooter}>
                      <button
                        className={`${styles.actionBtn} ${styles.btnDecline}`}
                      >
                        Laporkan
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.btnSecondary}`}
                      >
                        Sertifikat
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
