import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./CourseDetailPage.module.css";

// Mock data - would come from an API normally
const courses = [
  { id: 1, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#38BDF8", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { id: 2, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#FB923C", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { id: 3, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#F472B6", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
];

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find course by id or use a default one
  const course = courses.find(c => c.id === parseInt(id)) || courses[0];

  return (
    <DashboardLayout title="Course Details">
      <div className={styles.container}>
        {/* Main Detail Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={styles.detailCard}
        >
          <button className={styles.closeBtn} onClick={() => navigate(-1)}>✕</button>
          
          <div className={styles.cardContent}>
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                 <div className={styles.imagePlaceholder}></div>
                 {/* Decorative elements */}
                 <div className={styles.starIcon}>★</div>
                 <div className={styles.hexIcon}>⬢</div>
              </div>
            </div>
            
            <div className={styles.infoSection}>
              <h1 className={styles.title}>{course.title}</h1>
              <p className={styles.duration}>{course.duration}</p>
              <p className={styles.author}>{course.author}</p>
              
              <div className={styles.description}>
                <p>{course.description}</p>
              </div>
              
              <div className={styles.rating}>
                {"★".repeat(course.rating)}
              </div>
              
              <div className={styles.actionRow}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.bookBtn}
                  onClick={() => navigate(`/course-booking/${course.id}`)}

                >
                  Book Mentor
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Courses Section */}
        <div className={styles.relatedHeader}>
           <h2 className={styles.relatedTitle}>Related Courses</h2>
        </div>
        
        <div className={styles.courseGrid}>
          {courses.map((c, idx) => (
            <CourseCard key={c.id} course={c} index={idx} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
