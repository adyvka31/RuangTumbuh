import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MyCoursePage.module.css";
import { Popup } from "@/components/Popup/Popup";
import MyCourseCard from "@/components/MyCourseCard/MyCourseCard";
import { useMyCourses } from "@/hooks/useMyCourses";
import {
  getCourseExtras,
  MY_COURSE_TABS,
  COMPLETED_COURSES_DUMMY, // Pastikan menggunakan nama ini
} from "@/constants/courseData";
import {
  FiCheck,
  FiX,
  FiClock,
  FiBookOpen,
  FiStar,
  FiCalendar,
  FiMessageCircle,
  FiPlayCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";

export default function MyCoursePage() {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    popup,
    setPopup,
    myCreatedCourses,
    myBookings,
    incomingBookings,
    loading,
    statusUpdateMutation,
    refetchCreatedCourses,
    handleStatusUpdate, 
  } = useMyCourses();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
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
              Kelola semua pengajuan belajarmu, permintaan mengajar, dan riwayat
              di satu tempat.
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
          {MY_COURSE_TABS.map((tab) => {
            const IconComponent = tab.icon;
            const counts = {
              "Kursus Saya": myCreatedCourses.length,
              Permintaan: incomingBookings.length,
              Pengajuan: myBookings.length,
              Selesai: COMPLETED_COURSES_DUMMY.length,
            };
            return (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent />
                {tab.icon} <span>{tab.label}</span>
                {counts[tab.id] > 0 && (
                  <span className={styles.badge}>{counts[tab.id]}</span>
                )}
              </button>
            );
          })}
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
                  <div className={styles.emptyState}>Belum membuat kursus.</div>
                ) : (
                  myCreatedCourses.map((course) => (
                    <MyCourseCard
                      key={course.id}
                      course={course}
                      onRefresh={refetchCreatedCourses}
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
                  <div className={styles.emptyState}>Belum ada pengajuan.</div>
                ) : (
                  myBookings.map((booking) => {
                    const extras = getCourseExtras(booking.course.kategori);
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
                              <FiCalendar />{" "}
                              {new Date(
                                booking.scheduledAt,
                              ).toLocaleDateString()}
                            </div>
                          </div>
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
                              disabled={statusUpdateMutation.isPending}
                            >
                              <FiX /> Tolak
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.btnAccept}`}
                              onClick={() =>
                                handleStatusUpdate(booking.id, "ACCEPTED")
                              }
                              disabled={statusUpdateMutation.isPending}
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
                {COMPLETED_COURSES_DUMMY.map((course) => (
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
