import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./SchedulePage.module.css";
import { useNavigate } from "react-router-dom";

// Icons
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

const categories = ["Semua", "Mentoring", "Kelas", "Diskusi", "Workshop"];
const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function SchedulePage() {
  const navigate = useNavigate();

  // State Utama
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Kalender Dinamis
  const [currentDate, setCurrentDate] = useState(new Date()); // Menyimpan bulan & tahun yang sedang dilihat
  const [activeDate, setActiveDate] = useState(new Date().getDate().toString()); // Menyimpan tanggal yang di-klik
  const [activeCategory, setActiveCategory] = useState("Semua");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fungsi Pindah Bulan
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setActiveDate("1"); // Reset ke tanggal 1 saat ganti bulan
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setActiveDate("1"); // Reset ke tanggal 1 saat ganti bulan
  };

  // Fetch Data dari Backend
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!localUser.id) return;

        const response = await fetch(
          `http://localhost:5001/api/schedules/user/${localUser.id}`,
        );
        if (response.ok) {
          const data = await response.json();
          // Filter hanya yang berstatus Akan Datang atau Selesai (hilangkan yang Pending/Menunggu Konfirmasi)
          const validSchedules = data.filter(
            (s) => s.status !== "Menunggu Konfirmasi" && s.status !== "Pending",
          );
          setSchedules(validSchedules);
        }
      } catch (error) {
        console.error("Gagal load jadwal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  // Filter jadwal bulan ini untuk memunculkan titik kuning/hijau di kalender
  const schedulesThisMonth = schedules.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  // Menyimpan kumpulan tanggal yang punya jadwal (format string)
  const datesWithSchedules = schedulesThisMonth.map((s) =>
    new Date(s.date).getDate().toString(),
  );

  // Filter jadwal untuk kolom sebelah Kanan (Agenda)
  const currentSchedules = schedulesThisMonth.filter((s) => {
    const d = new Date(s.date);
    const matchDate = d.getDate().toString() === activeDate;
    const matchCat =
      activeCategory === "Semua" || s.category === activeCategory;
    return matchDate && matchCat;
  });

  // Logika Generator Susunan Hari Kalender
  const daysInMonthCount = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)

  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) =>
    (i + 1).toString(),
  );
  const emptyDaysStart = Array.from(
    { length: firstDayOfMonth },
    (_, i) => `empty-${i}`,
  );

  // Animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
  };

  const handleReschedule = (item) => {
    navigate("/add-schedule", { state: { editData: item } });
  };

  // Fungsi Selesai & Hapus
  const handleDelete = async (itemId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menyelesaikan dan menghapus jadwal ini dari kalender?",
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/user/schedule/${itemId}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setSchedules((prev) => prev.filter((s) => s.id !== itemId));
        } else {
          alert("Gagal menyelesaikan jadwal.");
        }
      } catch (error) {
        console.error("Error delete schedule:", error);
      }
    }
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

        {/* --- 50:50 LAYOUT GRID --- */}
        <div className={styles.splitLayout}>
          {/* ========================================================= */}
          {/* KOLOM KIRI: KALENDER & KATEGORI                             */}
          {/* ========================================================= */}
          <div className={styles.leftColumn}>
            {/* BOX KALENDER */}
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <button className={styles.navBtn} onClick={handlePrevMonth}>
                  <FiChevronLeft size={20} />
                </button>
                <h3 className={styles.monthTitle}>
                  {monthNames[month]} {year}
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

            {/* BOX KATEGORI FILTER */}
            <div className={styles.neoBox}>
              <h4 className={styles.boxTitle}>Filter Kategori Sesi</h4>
              <div className={styles.categoryWrap}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`${styles.catPill} ${activeCategory === cat ? styles.catActive : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* KOLOM KANAN: TIMELINE AGENDA                                */}
          {/* ========================================================= */}
          <div className={styles.rightColumn}>
            <div className={styles.agendaBox}>
              <div className={styles.timelineHeader}>
                <h3>
                  Agenda: {activeDate} {monthNames[month]} {year}
                </h3>
                <span className={styles.eventCount}>
                  {currentSchedules.length} Sesi
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
                    {currentSchedules.length === 0 ? (
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
                                    {item.time} - {item.endTime}
                                  </span>
                                </div>

                                <div
                                  className={styles.statusBadge}
                                  style={{
                                    backgroundColor: item.color,
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
                                  {item.category}
                                </span>
                                <h3 className={styles.courseTitle}>
                                  {item.title}
                                </h3>
                                <div className={styles.metaGrid}>
                                  <div className={styles.metaBadge}>
                                    <FiUser />{" "}
                                    <span>
                                      {item.partner}{" "}
                                      <small>({item.role})</small>
                                    </span>
                                  </div>
                                  <div className={styles.metaBadge}>
                                    <FiVideo /> <span>{item.platform}</span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.cardFooter}>
                                <button
                                  onClick={() => handleReschedule(item)}
                                  className={`${styles.actionBtn} ${styles.btnDetail}`}
                                >
                                  Reschedule
                                </button>
                                {item.status !== "Selesai" && (
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className={`${styles.actionBtn} ${styles.btnPrimary}`}
                                  >
                                    Sudah Selesai
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
