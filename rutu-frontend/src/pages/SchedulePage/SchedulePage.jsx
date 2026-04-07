import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./SchedulePage.module.css";
import { SCHEDULE_CATEGORIES, MONTH_NAMES } from "@/constants/scheduleData";
import { useScheduleData } from "@/hooks/useScheduleData";
import {
  FiCalendar,
  FiClock,
  FiVideo,
  FiUser,
  FiCheckCircle,
  FiPlayCircle,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function SchedulePage() {
  const {
    year,
    month,
    activeDate,
    setActiveDate,
    activeCategory,
    setActiveCategory,
    currentSchedules,
    datesWithSchedules,
    daysInMonth,
    emptyDaysStart,
    isLoading,
    isDeleting,
    deletingId,
    handlePrevMonth,
    handleNextMonth,
    handleReschedule,
    handleDelete,
    navigate,
  } = useScheduleData();

  // Konfigurasi Animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
  };

  return (
    <DashboardLayout title="Jadwal Belajar">
      <div className={styles.container}>
        {/* --- BANNER --- */}
        <motion.div
          className={styles.scheduleBanner}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className={styles.bannerText}>
            <h2>Atur Kegiatan Kamu 📅</h2>
            <p>
              Atur waktumu, jangan sampai ada sesi berharga yang terlewatkan.
              Semua jadwal pentingmu ada di sini!
            </p>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/add-schedule")}
          >
            <FiPlus size={20} strokeWidth={3} /> Jadwal Baru
          </button>
        </motion.div>

        <div className={styles.splitLayout}>
          {/* KOLOM KIRI (Kalender) */}
          <div className={styles.leftColumn}>
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <button className={styles.navBtn} onClick={handlePrevMonth}>
                  <FiChevronLeft size={20} />
                </button>
                <h3 className={styles.monthTitle}>
                  {MONTH_NAMES[month]} {year}
                </h3>
                <button className={styles.navBtn} onClick={handleNextMonth}>
                  <FiChevronRight size={20} />
                </button>
              </div>

              <div className={styles.calendarGrid}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className={styles.dayLabel}>
                      {day}
                    </div>
                  ),
                )}

                {emptyDaysStart.map((id) => (
                  <div key={id} className={styles.dateCellEmpty}></div>
                ))}

                {daysInMonth.map((day) => {
                  const hasSchedule = datesWithSchedules.includes(day);
                  const isActive = activeDate === day;

                  let classList = `${styles.day}`;
                  if (isActive) classList += ` ${styles.primaryDay}`;
                  else if (hasSchedule) classList += ` ${styles.secondaryDay}`;

                  return (
                    <button
                      key={day}
                      className={classList}
                      onClick={() => setActiveDate(day)}
                    >
                      {day}
                      {hasSchedule && !isActive && (
                        <div className={styles.eventDot}></div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className={styles.events}>
                <div className={`${styles.eventItem} ${styles.bgPrimary}`}>
                  <div
                    className={`${styles.colorBox} ${styles.colorPrimary}`}
                  ></div>
                  <span className={styles.eventText}>Tanggal Terpilih</span>
                </div>
                <div className={`${styles.eventItem} ${styles.bgSecondary}`}>
                  <div
                    className={`${styles.colorBox} ${styles.colorSecondary}`}
                  ></div>
                  <span className={styles.eventText}>Ada Jadwal Tersedia</span>
                </div>
              </div>
            </div>

            <div className={styles.neoBox}>
              <h4 className={styles.boxTitle}>Filter Kategori Sesi</h4>
              <div className={styles.categoryWrap}>
                {SCHEDULE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`${styles.catPill} ${
                      activeCategory === cat ? styles.catActive : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Agenda) */}
          <div className={styles.rightColumn}>
            <div className={styles.agendaBox}>
              <div className={styles.timelineHeader}>
                <h3>
                  Agenda: {activeDate} {MONTH_NAMES[month]} {year}
                </h3>
                <span className={styles.eventCount}>
                  {isLoading ? "..." : currentSchedules.length} Sesi
                </span>
              </div>

              <div className={styles.timelineWrapper}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeDate}-${activeCategory}-${month}-${year}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.timelineList}
                  >
                    {isLoading ? (
                      <div className={styles.emptyState}>
                        <p>Memuat jadwal...</p>
                      </div>
                    ) : currentSchedules.length === 0 ? (
                      <div className={styles.emptyState}>
                        <FiCalendar size={50} color="#999" />
                        <h4>Hari yang tenang!</h4>
                        <p>
                          Tidak ada jadwal{" "}
                          {activeCategory !== "Semua"
                            ? `untuk ${activeCategory}`
                            : ""}{" "}
                          di tanggal ini.
                        </p>
                      </div>
                    ) : (
                      currentSchedules.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          className={styles.timelineItem}
                        >
                          <div className={styles.cardCol}>
                            <div className={styles.scheduleCard}>
                              <div className={styles.cardHeader}>
                                <div className={styles.timeBadgeInside}>
                                  <FiClock className={styles.timeIcon} />
                                  <span>
                                    {item.time} - {item.endTime || "Selesai"}
                                  </span>
                                </div>

                                <div
                                  className={styles.statusBadge}
                                  style={{
                                    backgroundColor: item.color || "#e2e8f0",
                                    color: "#000",
                                  }}
                                >
                                  {item.status === "Selesai" && (
                                    <FiCheckCircle />
                                  )}
                                  {item.status === "Berlangsung" && (
                                    <FiPlayCircle />
                                  )}
                                  {item.status}
                                </div>
                              </div>

                              <div className={styles.cardBody}>
                                <span className={styles.catLabel}>
                                  {item.category || "General"}
                                </span>
                                <h3 className={styles.courseTitle}>
                                  {item.title}
                                </h3>
                                <div className={styles.metaGrid}>
                                  <div className={styles.metaBadge}>
                                    <FiUser />{" "}
                                    <span>
                                      {item.partner || "Anonim"}{" "}
                                      <small>({item.role || "User"})</small>
                                    </span>
                                  </div>
                                  <div className={styles.metaBadge}>
                                    <FiVideo />{" "}
                                    <span>{item.platform || "Online"}</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.cardFooter}>
                                <button
                                  onClick={() => handleReschedule(item)}
                                  className={`${styles.actionBtn} ${styles.btnDetail}`}
                                  disabled={isDeleting}
                                >
                                  Reschedule
                                </button>
                                {item.status !== "Selesai" && (
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className={`${styles.actionBtn} ${styles.btnPrimary}`}
                                    disabled={isDeleting}
                                  >
                                    {isDeleting && deletingId === item.id
                                      ? "Menyelesaikan..."
                                      : "Sudah Selesai"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
