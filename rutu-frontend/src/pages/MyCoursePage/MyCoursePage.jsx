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
  FiCalendar,
  FiMessageCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiStar,
  FiSearch,
  FiEye,
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
    handleChatUser,
    handleCompleteSession,
    completeBookingMutation,
    handleSubmitFeedback,
    submitFeedbackMutation,
  } = useMyCourses();

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    bookingId: null,
    rating: 0,
    review: "",
  });

  const [viewFeedbackModal, setViewFeedbackModal] = useState({
    isOpen: false,
    rating: 0,
    review: "",
    studentName: "",
  });

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

    // Pastikan token huruf besar semua dan tidak ada spasi
    const cleanToken = tokenModal.token.trim().toUpperCase();

    // Panggil fungsi handleCompleteSession dengan cleanToken
    handleCompleteSession(tokenModal.bookingId, cleanToken);

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
                    const dateObj = new Date(booking.scheduledAt);
                    return (
                      <div key={booking.id} className={styles.neoCard}>
                        {/* HEADER YANG SAMA DENGAN PERMINTAAN */}
                        <div className={styles.neoCardHeader}>
                          <div
                            className={styles.avatarWrap}
                            style={{
                              backgroundColor: extras.color,
                              fontFamily: "'Fredoka', sans-serif",
                              fontWeight: 700,
                              color: "#000",
                            }}
                          >
                            {getInitials(booking.partnerName)}
                          </div>
                          <div className={styles.headerInfo}>
                            <h4>{booking.partnerName}</h4>
                            <span>Mentor</span>
                          </div>
                          <div
                            className={styles.statusBadge}
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              padding: "4px 10px",
                              borderRadius: "10px",
                              border: "1px solid",
                              backgroundColor:
                                booking.status === "ACCEPTED"
                                  ? "#dcfce7"
                                  : booking.status === "PENDING"
                                    ? "#fef9c3"
                                    : "#fee2e2",
                              color:
                                booking.status === "ACCEPTED"
                                  ? "#16a34a"
                                  : booking.status === "PENDING"
                                    ? "#ca8a04"
                                    : "#ef4444",
                            }}
                          >
                            {booking.status}
                          </div>
                        </div>

                        {/* BODY KONTEN */}
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
                        </div>

                        {/* FOOTER AKSI UNTUK PENDING */}
                        {booking.status === "PENDING" && (
                          <div className={styles.neoCardFooter}>
                            <button
                              className={`${styles.actionBtn} ${styles.btnDecline}`}
                              onClick={() =>
                                handleStatusUpdate(booking.id, "CANCELLED")
                              }
                              disabled={statusUpdateMutation.isPending}
                            >
                              <FiX /> Batalkan
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.btnJoin}`}
                              onClick={() => handleChatUser(booking.tutorId)}
                            >
                              <FiMessageCircle /> Chat Mentor
                            </button>
                          </div>
                        )}

                        {/* FOOTER AKSI UNTUK ACCEPTED (AKTIF) */}
                        {booking.status === "ACCEPTED" && (
                          <div
                            className={styles.neoCardFooter}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleChatUser(booking.tutorId)} // Chat Mentor
                              style={{
                                backgroundColor: "#38bdf8",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <FiMessageCircle /> Chat Mentor
                            </button>

                            {/* --- KOTAK PENAMPIL TOKEN UNTUK SISWA --- */}
                            <div
                              style={{
                                backgroundColor: "#f8f9fa",
                                padding: "12px",
                                borderRadius: "12px",
                                border: "2px dashed #000",
                                textAlign: "center",
                                marginTop: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  color: "#666",
                                }}
                              >
                                Token Sesi Anda:
                              </span>
                              <div
                                style={{
                                  fontSize: "1.3rem",
                                  fontWeight: 900,
                                  letterSpacing: "3px",
                                  margin: "8px 0",
                                  fontFamily:
                                    "'Courier New', Courier, monospace",
                                  color: "#000",
                                  background: "#fff",
                                  border: "2px solid #000",
                                  padding: "5px",
                                  borderRadius: "8px",
                                }}
                              >
                                {booking.token || "------"}
                              </div>
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#666",
                                  margin: 0,
                                  fontWeight: 600,
                                }}
                              >
                                *Kirimkan token ini ke mentor melalui chat untuk
                                menyelesaikan sesi.
                              </p>
                            </div>
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
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {/* TOMBOL 1: CHAT SISWA */}
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleChatUser(booking.studentId)}
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
                    const dateObj = new Date(booking.scheduledAt);
                    // Cek apakah user adalah siswa di booking ini
                    const isStudent = booking.role === "Sebagai Siswa";

                    return (
                      <div key={booking.id} className={styles.neoCard}>
                        <div className={styles.neoCardHeader}>
                          <div
                            className={styles.avatarWrap}
                            style={{
                              backgroundColor: extras.color,
                              fontFamily: "'Fredoka', sans-serif",
                              fontWeight: 700,
                              color: "#000",
                            }}
                          >
                            {getInitials(booking.partnerName)}
                          </div>
                          <div className={styles.headerInfo}>
                            <h4>{booking.partnerName}</h4>
                            <span>
                              {booking.role === "Sebagai Siswa"
                                ? "Mentor"
                                : "Siswa"}
                            </span>
                          </div>
                          <div
                            className={styles.statusBadge}
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              padding: "4px 10px",
                              borderRadius: "10px",
                              backgroundColor: "#dcfce7",
                              color: "#16a34a",
                              border: "1px solid #16a34a",
                            }}
                          >
                            SELESAI
                          </div>
                        </div>

                        <div className={styles.cardBody}>
                          <h3 className={styles.topicTitle}>
                            {booking.course.name}
                          </h3>
                          <div className={styles.timeInfo}>
                            <div className={styles.timeBadge}>
                              <FiCalendar /> Selesai:{" "}
                              {dateObj.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* FOOTER AKSI UNTUK TAB SELESAI */}
                        <div
                          className={styles.neoCardFooter}
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          {/* LOGIKA JIKA USER ADALAH SISWA */}
                          {isStudent ? (
                            booking.rating > 0 ? (
                              // Jika Siswa SUDAH mengisi feedback
                              <button
                                className={styles.actionBtn}
                                onClick={() => navigate("/search")}
                                style={{
                                  backgroundColor: "#facc15",
                                  color: "#000",
                                  flex: 1,
                                  minWidth: "140px",
                                }}
                              >
                                <FiSearch /> Cari Kursus Lain
                              </button>
                            ) : (
                              // Jika Siswa BELUM mengisi feedback
                              <button
                                className={styles.actionBtn}
                                onClick={() =>
                                  setFeedbackModal({
                                    isOpen: true,
                                    bookingId: booking.id,
                                    rating: 0,
                                    review: "",
                                  })
                                }
                                style={{
                                  backgroundColor: "#8b5cf6",
                                  color: "#fff",
                                  flex: 1,
                                  minWidth: "140px",
                                }}
                              >
                                <FiStar /> Berikan Feedback
                              </button>
                            )
                          ) : (
                            /* LOGIKA JIKA USER ADALAH MENTOR */
                            <button
                              className={styles.actionBtn}
                              onClick={() => {
                                if (booking.rating > 0) {
                                  setViewFeedbackModal({
                                    isOpen: true,
                                    rating: booking.rating,
                                    review: booking.review,
                                    studentName: booking.partnerName,
                                  });
                                } else {
                                  setPopup({
                                    isOpen: true,
                                    type: "info",
                                    title: "Belum Ada Rating",
                                    description:
                                      "Siswa belum memberikan ulasan untuk sesi ini.",
                                  });
                                }
                              }}
                              style={{
                                backgroundColor:
                                  booking.rating > 0 ? "#38bdf8" : "#e2e8f0",
                                color: "#000",
                                flex: 1,
                                minWidth: "140px",
                                opacity: booking.rating > 0 ? 1 : 0.7,
                              }}
                            >
                              <FiEye />{" "}
                              {booking.rating > 0
                                ? "Lihat Feedback"
                                : "Belum Dinilai"}
                            </button>
                          )}
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

      <AnimatePresence>
        {feedbackModal.isOpen && (
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
                  setFeedbackModal({
                    isOpen: false,
                    bookingId: null,
                    rating: 0,
                    review: "",
                  })
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

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    margin: "0 0 10px 0",
                  }}
                >
                  Nilai Pengalamanmu! 🌟
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                  Berikan penilaian untuk mentor dan kursus ini.
                </p>
              </div>

              {/* Bintang Rating */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={36}
                    fill={feedbackModal.rating >= star ? "#facc15" : "none"}
                    color={feedbackModal.rating >= star ? "#facc15" : "#cbd5e1"}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() =>
                      setFeedbackModal({ ...feedbackModal, rating: star })
                    }
                  />
                ))}
              </div>

              <div style={{ marginBottom: "25px" }}>
                <textarea
                  placeholder="Ceritakan pengalaman belajarmu... (Opsional)"
                  value={feedbackModal.review}
                  onChange={(e) =>
                    setFeedbackModal({
                      ...feedbackModal,
                      review: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #000",
                    borderRadius: "12px",
                    fontFamily: "'plus-jakarta', sans-serif",
                    minHeight: "100px",
                    resize: "none",
                  }}
                />
              </div>

              <button
                onClick={() => {
                  if (feedbackModal.rating === 0) {
                    setPopup({
                      isOpen: true,
                      type: "error",
                      title: "Oops!",
                      description:
                        "Silakan pilih bintang rating terlebih dahulu.",
                    });
                    return;
                  }
                  handleSubmitFeedback(
                    feedbackModal.bookingId,
                    feedbackModal.rating,
                    feedbackModal.review,
                  );
                  setFeedbackModal({
                    isOpen: false,
                    bookingId: null,
                    rating: 0,
                    review: "",
                  });
                }}
                disabled={submitFeedbackMutation.isPending}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#8b5cf6",
                  color: "#fff",
                  border: "3px solid #000",
                  borderRadius: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "4px 4px 0px #000",
                }}
              >
                {submitFeedbackMutation.isPending
                  ? "Mengirim..."
                  : "Kirim Feedback"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewFeedbackModal.isOpen && (
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
                  setViewFeedbackModal({
                    isOpen: false,
                    rating: 0,
                    review: "",
                    studentName: "",
                  })
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

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "12px",
                    backgroundColor: "#38bdf8",
                    border: "3px solid #000",
                    borderRadius: "50%",
                    marginBottom: "10px",
                  }}
                >
                  <FiStar size={28} color="#000" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    margin: "0 0 5px 0",
                  }}
                >
                  Ulasan dari {viewFeedbackModal.studentName}
                </h3>
              </div>

              {/* Bintang Rating Read-Only */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={32}
                    fill={viewFeedbackModal.rating >= star ? "#facc15" : "none"}
                    color={
                      viewFeedbackModal.rating >= star ? "#facc15" : "#cbd5e1"
                    }
                  />
                ))}
              </div>

              <div
                style={{
                  marginBottom: "25px",
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  border: "2px dashed #000",
                  borderRadius: "12px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'plus-jakarta', sans-serif",
                    fontSize: "0.95rem",
                    color: "#333",
                    margin: 0,
                    fontStyle: viewFeedbackModal.review ? "normal" : "italic",
                    textAlign: "center",
                  }}
                >
                  {viewFeedbackModal.review
                    ? `"${viewFeedbackModal.review}"`
                    : "Siswa tidak meninggalkan ulasan tertulis, hanya rating bintang."}
                </p>
              </div>

              <button
                onClick={() =>
                  setViewFeedbackModal({
                    isOpen: false,
                    rating: 0,
                    review: "",
                    studentName: "",
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "3px solid #000",
                  borderRadius: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Tutup
              </button>
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
