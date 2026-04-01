import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./SearchPage.module.css";
import CourseCard from "@/components/CourseCard/CourseCard";
import { FiSearch, FiSliders } from "react-icons/fi";

// Data Dummy
const allCourses = [
  {
    id: 1,
    title: "Frontend Basic: HTML, CSS, JS",
    author: "Grace Ashcroft",
    duration: "3h 30m",
    rating: 5,
    color: "#38BDF8",
    date: "20 Mar 2026",
    category: "Frontend",
    level: "Beginner",
    price: "Gratis",
  },
  {
    id: 2,
    title: "Mastering React & Framer Motion",
    author: "Grace Ashcroft",
    duration: "5h 15m",
    rating: 5,
    color: "#FB923C",
    date: "22 Mar 2026",
    category: "Frontend",
    level: "Intermediate",
    price: "Premium",
  },
  {
    id: 3,
    title: "Backend Node.js & Express API",
    author: "Harvey Specter",
    duration: "6h 00m",
    rating: 4,
    color: "#F472B6",
    date: "25 Mar 2026",
    category: "Backend",
    level: "Intermediate",
    price: "Premium",
  },
  {
    id: 4,
    title: "UI/UX Design Fundamental",
    author: "John Doe",
    duration: "4h 20m",
    rating: 5,
    color: "#FACC15",
    date: "28 Mar 2026",
    category: "UI/UX Design",
    level: "Beginner",
    price: "Gratis",
  },
  {
    id: 5,
    title: "Advanced Laravel 11",
    author: "Jane Smith",
    duration: "8h 45m",
    rating: 5,
    color: "#10B981",
    date: "30 Mar 2026",
    category: "Backend",
    level: "Advanced",
    price: "Premium",
  },
  {
    id: 6,
    title: "Python for Data Science",
    author: "Mike Ross",
    duration: "10h 10m",
    rating: 3,
    color: "#A78BFA",
    date: "02 Apr 2026",
    category: "Data Science",
    level: "Beginner",
    price: "Premium",
  },
  {
    id: 7,
    title: "Flutter Mobile Development",
    author: "Louis Litt",
    duration: "7h 00m",
    rating: 5,
    color: "#38BDF8",
    date: "15 Apr 2026",
    category: "Mobile Dev",
    level: "Beginner",
    price: "Premium",
  },
  {
    id: 8,
    title: "CSS Mastery & Animations",
    author: "Donna Paulsen",
    duration: "2h 50m",
    rating: 4,
    color: "#F472B6",
    date: "10 Apr 2026",
    category: "Frontend",
    level: "Advanced",
    price: "Gratis",
  },
];

const categories = [
  "Semua",
  "Frontend",
  "Backend",
  "UI/UX Design",
  "Mobile Dev",
  "Data Science",
  "Matematika",
  "Fisika",
  "Bahasa Inggris",
  "Bahasa Indonesia",
  "Sejarah",
  "Pengembangan Diri",
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredCourses = allCourses.filter((course) => {
    const matchCategory =
      activeCategory === "Semua" || course.category === activeCategory;
    const matchSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <DashboardLayout title="Materi & Kursus">
      <div className={styles.container}>
        {/* --- HERO BANNER --- */}
        <motion.div
          className={styles.searchBanner}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className={styles.bannerContent}>
            <h2>Eksplorasi Skill Baru 🚀</h2>
            <p>
              Temukan ratusan materi, kursus, dan sesi mentoring yang siap
              membantu karirmu.
            </p>
          </div>
          <div className={styles.mascotBox}>
            <div className={styles.floatingShape}>✦</div>
            <div className={styles.floatingShape2}>●</div>
          </div>
        </motion.div>

        {/* --- SEARCH BAR & FILTER SECTION (Tanpa Background) --- */}
        <div className={styles.searchControlArea}>
          {/* Baris Pencarian (Search Input + Button Filter) */}
          <div className={styles.searchBarRow}>
            <div className={styles.searchContainer}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Cari kursus, topik, atau mentor..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.filterBtn}>
              <FiSliders size={24} />
            </button>
          </div>

          {/* Baris Kategori (Style mirip Tab Booking Page) */}
          <div className={styles.categoriesWrapper}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryPill} ${activeCategory === cat ? styles.pillActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- KURSUS GRID --- */}
        {filteredCourses.length > 0 ? (
          <motion.div
            className={styles.courseGrid}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                >
                  <CourseCard course={course} index={idx} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>Oops! 🙈</h3>
            <p>
              Kursus dengan kata kunci <strong>"{searchQuery}"</strong> tidak
              ditemukan.
            </p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Semua");
              }}
            >
              Reset Pencarian
            </button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
