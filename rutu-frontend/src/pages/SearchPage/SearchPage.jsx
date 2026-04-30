import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./SearchPage.module.css";
import CourseCard from "@/components/CourseCard/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCard/CourseCardSkeleton";
import { FiSearch, FiSliders, FiLoader } from "react-icons/fi";
import { useSearchCourses } from "@/hooks/useSearchCourses";
import { CATEGORY_VALUES } from "@/constants/categoryConstants";

export default function SearchPage() {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    allCourses,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchCourses();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const FILTER_TABS = ["Semua", ...CATEGORY_VALUES];

  return (
    <DashboardLayout title="Materi & Kursus">
      <div className={styles.container}>
        {/* HERO BANNER */}
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

        {/* SEARCH & FILTER CONTROLS */}
        <div className={styles.searchControlArea}>
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

          {/* FILTER CATEGORY PILLS */}
          <div className={styles.categoriesWrapper}>
            {FILTER_TABS.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryPill} ${
                  activeCategory === cat ? styles.pillActive : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* COURSE LIST AREA */}
        {isLoading ? (
          <motion.div
            className={styles.courseGrid}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                <CourseCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : allCourses.length > 0 ? (
          <>
            <motion.div
              className={styles.courseGrid}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {allCourses.map((course, idx) => (
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

            {/* LOAD MORE BUTTON */}
            {hasNextPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                  marginBottom: "20px",
                }}
              >
                <motion.button
                  whileHover={{ y: -3, boxShadow: "5px 5px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  style={{
                    backgroundColor: "white",
                    padding: "12px 30px",
                    border: "2px solid #000",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {isFetchingNextPage ? (
                    <FiLoader className="spin" />
                  ) : (
                    "Tampilkan Lebih Banyak ↓"
                  )}
                </motion.button>
              </div>
            )}
          </>
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
