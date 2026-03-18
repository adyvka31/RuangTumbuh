import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";

export default function CourseCard({ course, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
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
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.seeMoreBtn}
            onClick={() => navigate(`/course/${course.id}`)}
          >
            See More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
