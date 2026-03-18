import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./CourseBookingPage.module.css";

// Mock data - would come from an API normally
const courses = [
  { id: 1, title: "Basic Frontend", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#38BDF8" },
  { id: 2, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#FB923C" },
  { id: 3, title: "Frontend Basic", author: "Grace ashcroft", duration: "1 - 3h", rating: 5, color: "#F472B6" },
];

export default function CourseBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find course by id or use a default one
  const course = courses.find(c => c.id === parseInt(id)) || courses[0];

  return (
    <DashboardLayout title="Course Booking">
      <div className={styles.container}>
        {/* Booking Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={styles.bookingCard}
        >
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>{course.title}</h1>
            <p className={styles.author}>{course.author}</p>
          </div>
          
          <div className={styles.formContainer}>
            <div className={styles.inputGroup}>
                <input type="text" placeholder="Username" className={styles.input} />
            </div>
            
            <div className={styles.inputGroup}>
                <div className={styles.selectWrapper}>
                   <input type="text" placeholder="Date" className={styles.input} />
                   <span className={styles.dropdownIcon}>▼</span>
                </div>
            </div>
            
            <div className={styles.inputGroup}>
                <div className={styles.selectWrapper}>
                   <input type="text" placeholder="Time" className={styles.input} />
                   <span className={styles.dropdownIcon}>▼</span>
                </div>
            </div>
            
            <div className={styles.inputGroup}>
                <textarea 
                    placeholder="Understanding Gaps" 
                    className={styles.textarea}
                    rows="4"
                ></textarea>
            </div>
          </div>
          
          <div className={styles.actionRow}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              ←
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.submitBtn}
              onClick={() => navigate('/booking')} // Navigate to tracker page
            >
              Book Mentor
            </motion.button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
