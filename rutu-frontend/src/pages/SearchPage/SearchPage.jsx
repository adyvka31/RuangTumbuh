import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./SearchPage.module.css";

// Assuming we might have some course card images later, but for now using colored placeholders
export default function SearchPage() {
  const courses = [
    { id: 1, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#38BDF8" },
    { id: 2, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#FB923C" },
    { id: 3, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#F472B6" },
    { id: 4, title: "UI/UX Design", author: "John Doe", duration: "2 - 4h", rating: 4, color: "#FB923C" },
    { id: 5, title: "React Advanced", author: "Jane Smith", duration: "5 - 8h", rating: 5, color: "#FACC15" },
    { id: 6, title: "Node JS", author: "Mike Ross", duration: "3 - 5h", rating: 3, color: "#38BDF8" },
    { id: 7, title: "Python Basics", author: "Harvey Specter", duration: "1 - 2h", rating: 5, color: "#38BDF8" },
    { id: 8, title: "CSS Mastery", author: "Donna Paulsen", duration: "2 - 3h", rating: 4, color: "#F472B6" },
    { id: 9, title: "Mobile Dev", author: "Louis Litt", duration: "4 - 6h", rating: 5, color: "#FB923C" },
  ];

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout title="Product">
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.date}>{currentDate}</p>
        </div>

        <div className={styles.searchBarRow}>
           <div className={styles.searchContainer}>
              <input type="text" placeholder="Search" className={styles.searchInput} />
           </div>
           <button className={styles.filterBtn}>
              <div className={styles.filterIcon}>
                 <span></span>
                 <span></span>
                 <span></span>
              </div>
           </button>
        </div>

        <div className={styles.courseGrid}>
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={styles.courseCard}
              style={{ backgroundColor: course.color }}
            >
              <div className={styles.cardHeader}>
                 <div className={styles.imagePlaceholder}></div>
                 <div className={styles.cardInfo}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseAuthor}>{course.author}</p>
                    <p className={styles.courseDuration}>{course.duration}</p>
                    <div className={styles.rating}>
                        {"★".repeat(course.rating)}
                    </div>
                    <button className={styles.seeMoreBtn}>See More</button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
