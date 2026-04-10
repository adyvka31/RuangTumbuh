import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MyCoursePage.module.css";
import { Popup } from "@/components/Popup/Popup";
import CourseCard from "@/components/CourseCard/CourseCard";
import { Input } from "@/components/Input/Input";
import { useMyCourses } from "@/hooks/useMyCourses";
import { getCourseExtras, MY_COURSE_TABS } from "@/constants/courseData";
import {
  FiCheck,
  FiX,
  FiClock,
  FiBookOpen,
  FiCalendar,
  FiMessageCircle,
  FiPlayCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiAward,
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
    completedBookings,
    loading,
    statusUpdateMutation,
    refetchCreatedCourses,
    handleStatusUpdate,
  } = useMyCourses();

  // STATE UNTUK POPUP TOKEN
  const [tokenModal, setTokenModal] = useState({
    isOpen: false,
    bookingId: null,
    token: "",
  });

  // FUNGSI UNTUK MENDAPATKAN INISIAL NAMA SISWA
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.charAt(0).toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // FUNGSI SUBMIT TOKEN
  const handleTokenSubmit = () => {
    if (!tokenModal.token.trim()) {
      setPopup({
        isOpen: true,
        type: "error",
        title: "Token Kosong",
        description: "Harap masukkan Token ID yang diberikan oleh siswa.",
      });
      return;
    }

    // Asumsi: Di masa depan token ini divalidasi ke backend.
    // Saat ini, kita langsung proses status menjadi COMPLETED
    handleStatusUpdate(tokenModal.bookingId, "COMPLETED");
    setTokenModal({ isOpen: false, bookingId: null, token: "" });
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
            <h2>Manajemen Kursus 🚀</h2>
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
            const counts = {
              "Kursus Saya": myCreatedCourses.length,
              Permintaan: incomingBookings.length,
              Pengajuan: myBookings.length,
              Selesai: completedBookings.length,
            };
            return (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
                {counts[tab.id] > 0 && (
                  <span className={styles.badge}>{counts[tab.id]}</span>
                )}
              </button>
            );
          })}
        </motion.div>

        <div className={styles.tabContentArea}>
          <AnimatePresence mode="wait">
            {/* --- TAB 1: KURSUS SAYA --- */}
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
                    <CourseCard
                      key={course.id}
                      course={course}
                      isMyCourse={true}
                      onRefresh={refetchCreatedCourses}
                    />
                  ))
                )}
              </motion.div>
            )}

            {/* --- TAB 2: PENGAJUAN (SISWA) --- */}
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
                    Belum ada pengajuan. Cari kursus di Search!
                  </div>
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
                            <span>Tutor</span>
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
                        {booking.status === "ACCEPTED" && (
                          <div className={styles.neoCardFooter}>
                            <button
                              className={`${styles.actionBtn} ${styles.btnChat}`}
                              onClick={() =>
                                handleStatusUpdate(booking.id, "COMPLETED")
                              }
                            >
                              <FiCheckCircle /> Tandai Selesai
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* --- TAB 3: PERMINTAAN MASUK (TUTOR) --- */}
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
                    Belum ada permintaan masuk dari siswa.
                  </div>
                ) : (
                  incomingBookings.map((booking) => {
                    const dateObj = new Date(booking.scheduledAt);
                    return (
                      <div key={booking.id} className={styles.neoCard}>
                        <div className={styles.neoCardHeader}>
                          {/* AVATAR INISIAL NAMA SISWA */}
                          <div
                            className={styles.avatarWrap}
                            style={{
                              backgroundColor: "#38BDF8",
                              fontFamily: "'Fredoka', sans-serif",
                              fontWeight: 700,
                              color: "#000",
                            }}
                          >
                            {getInitials(booking.studentName)}
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
                                backgroundColor: "#dcfce7",
                                color: "#16a34a",
                              }}
                            >
                              {booking.status}
                            </div>
                          )}
                        </div>
                        <div className={styles.cardBody}>
                          <h3 className={styles.topicTitle}>
                            {booking.course.name}
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
                              <strong>Catatan Siswa:</strong>{" "}
                              <p>"{booking.note}"</p>
                            </div>
                          )}
                        </div>
                        {booking.status === "PENDING" ? (
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
                        ) : (
                          <div
                            className={styles.neoCardFooter}
                            style={{ display: "column", gap: "10px", flexDirection: "column" }}
                          >
                            {/* TOMBOL 1: CHAT SISWA */}
                            <button
                              className={styles.actionBtn}
                              onClick={() =>
                                navigate(`/messages/${booking.studentId}`)
                              }
                              style={{
                                backgroundColor: "#38bdf8",
                                color: "#000",
                                flex: 1,
                              }}
                            >
                              <FiMessageCircle /> Chat Siswa
                            </button>

                            {/* TOMBOL 2: AKHIRI SESI (MODAL TOKEN) */}
                            <button
                              className={styles.actionBtn}
                              onClick={() =>
                                setTokenModal({
                                  isOpen: true,
                                  bookingId: booking.id,
                                  token: "",
                                })
                              }
                              disabled={statusUpdateMutation.isPending}
                              style={{
                                backgroundColor: "#8b5cf6",
                                color: "#fff",
                                flex: 1,
                              }}
                            >
                              <FiAward /> Akhiri Sesi
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* --- TAB 4: RIWAYAT SELESAI --- */}
            {activeTab === "Selesai" && (
              <motion.div
                key="selesai"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.gridContainer}
              >
                {completedBookings.length === 0 ? (
                  <div className={styles.emptyState}>
                    Belum ada riwayat kursus yang diselesaikan.
                  </div>
                ) : (
                  completedBookings.map((booking) => {
                    const extras = getCourseExtras(booking.course.kategori);
                    return (
                      <div
                        key={booking.id}
                        className={`${styles.neoCard} ${styles.cardCompleted}`}
                        style={{ borderColor: "#10B981" }}
                      >
                        <div className={styles.neoCardHeader}>
                          <div
                            className={styles.avatarWrap}
                            style={{ backgroundColor: extras.color }}
                          >
                            {extras.emoji}
                          </div>
                          <div className={styles.headerInfo}>
                            <h4>{booking.partnerName}</h4>
                            <span>{booking.role}</span>
                          </div>
                          <div
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: "#10B981",
                              color: "#fff",
                              borderColor: "#000",
                            }}
                          >
                            SELESAI
                          </div>
                        </div>
                        <div className={styles.cardBody}>
                          <h3 className={styles.topicTitle}>
                            <FiBookOpen /> {booking.course.name}
                          </h3>
                          <div
                            className={styles.timeInfo}
                            style={{ marginTop: "10px" }}
                          >
                            <div className={styles.timeBadge}>
                              <FiCalendar /> Selesai pada:{" "}
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
          </AnimatePresence>
        </div>
      </motion.div>

      {/* MODAL POPUP UNTUK INPUT TOKEN (Neo-Brutalism Style) */}
      <AnimatePresence>
        {tokenModal.isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                backgroundColor: "#fff",
                border: "4px solid #000",
                borderRadius: "24px",
                padding: "30px",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "8px 8px 0px #000",
                position: "relative",
              }}
            >
              <button
                onClick={() =>
                  setTokenModal({ isOpen: false, bookingId: null, token: "" })
                }
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                <FiX />
              </button>

              <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "15px",
                    backgroundColor: "#facc15",
                    border: "3px solid #000",
                    borderRadius: "50%",
                    marginBottom: "15px",
                    boxShadow: "4px 4px 0px #000",
                  }}
                >
                  <FiAward size={32} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "#000",
                    margin: "0 0 10px 0",
                  }}
                >
                  Akhiri Sesi Belajar
                </h3>
                <p
                  style={{
                    fontFamily: "'plus-jakarta', sans-serif",
                    fontSize: "0.95rem",
                    color: "#4b5563",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Untuk menyelesaikan sesi ini, mintalah{" "}
                  <strong>Token ID</strong> kepada siswa Anda dan masukkan ke
                  dalam kolom di bawah.
                </p>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <Input
                  label="Masukkan Token ID"
                  placeholder="Contoh: RT-12345"
                  value={tokenModal.token}
                  onChange={(e) =>
                    setTokenModal({ ...tokenModal, token: e.target.value })
                  }
                />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() =>
                    setTokenModal({ isOpen: false, bookingId: null, token: "" })
                  }
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#fff",
                    border: "3px solid #000",
                    borderRadius: "12px",
                    fontFamily: "'plus-jakarta', sans-serif",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={handleTokenSubmit}
                  disabled={statusUpdateMutation.isPending}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#10b981",
                    color: "#fff",
                    border: "3px solid #000",
                    borderRadius: "12px",
                    fontFamily: "'plus-jakarta', sans-serif",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "4px 4px 0px #000",
                    transition: "all 0.2s",
                  }}
                >
                  {statusUpdateMutation.isPending ? "Proses..." : "Selesaikan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
