import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";

import styles from "./BookingPage.module.css";

import { useNavigate } from "react-router-dom";


const mentorRequests = [
  { id: 1, name: "Alexander Pierce", topic: "UI/UX Design", time: "2 hours ago", emoji: "👨‍💻", color: "#38BDF8" },
  { id: 2, name: "Sarah Jenkins", topic: "React Development", time: "5 hours ago", emoji: "👩‍🏫", color: "#FB923C" },
  { id: 3, name: "Michael Chen", topic: "Backend Node.js", time: "1 day ago", emoji: "🧔", color: "#F472B6" },
];

const completedCourses = [
  { id: 1, name: "Alexander Pierce", topic: "UI/UX Design", time: "2 hours ago", emoji: "👨‍💻", color: "#38BDF8" },
];

export default function BookingPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="My Courses">
      <div className={styles.container}>
        {/* Status Tracker Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={styles.statusCard}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Your Booking</h2>
          </div>

          <div className={styles.trackerContainer}>
            <div className={styles.step}>
              <div className={`${styles.iconCircle} ${styles.submit}`}>😌</div>
              <span className={styles.stepLabel}>Submit</span>
            </div>

            <div className={`${styles.line} ${styles.lineGreen}`}></div>

            <div className={styles.step}>
              <div className={`${styles.iconCircle} ${styles.onView}`}>👀</div>
              <span className={styles.stepLabel}>On View</span>
            </div>

            <div className={`${styles.line} ${styles.lineRed}`}></div>

            <div className={styles.step}>
              <div className={`${styles.iconCircle} ${styles.reject}`}>😡</div>
              <span className={styles.stepLabel}>Reject</span>
            </div>
          </div>

          <div className={styles.cardFooter}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.backBtn}
            >
              Back
            </motion.button>
          </div>
        </motion.div>

        {/* Completed Course Section */}
        <div className={styles.mentorRequestSection}>
          <h2 className={styles.sectionTitle}>Completed Course</h2>
          <div className={styles.mentorGrid}>
            {completedCourses.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
                className={styles.mentorCard}
                style={{ backgroundColor: request.color + "22" }}
              >
                <div className={styles.mentorAvatar} style={{ border: `4px solid ${request.color}`, boxShadow: `4px 4px 0px #000` }}>
                  {request.emoji}
                </div>
                <div className={styles.mentorInfo}>
                  <h3 className={styles.mentorName}>{request.name}</h3>
                  <p className={styles.mentorTopic}>{request.topic}</p>
                  <span className={styles.requestTime}>🕒 {request.time}</span>
                </div>
                <div className={styles.actionButtons}>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.presenceBtn} onClick={() => navigate("/presence")} >Isi Presensi</motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.declineBtn}>Report</motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.mentorRequestSection}>
          <h2 className={styles.sectionTitle}>Mentor Requests</h2>
          <div className={styles.mentorGrid}>
            {mentorRequests.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
                className={styles.mentorCard}
                style={{ backgroundColor: request.color + "22" }}
              >
                <div className={styles.mentorAvatar} style={{ border: `4px solid ${request.color}`, boxShadow: `4px 4px 0px #000` }}>
                  {request.emoji}
                </div>
                <div className={styles.mentorInfo}>
                  <h3 className={styles.mentorName}>{request.name}</h3>
                  <p className={styles.mentorTopic}>{request.topic}</p>
                  <span className={styles.requestTime}>🕒 {request.time}</span>
                </div>
                <div className={styles.actionButtons}>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.acceptBtn}>Accept</motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={styles.declineBtn}>Decline</motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

