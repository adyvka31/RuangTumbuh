import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./DashboardPage.module.css";

// Assets
import shape10 from "@/assets/shape10.svg";
import shape11 from "@/assets/shape11.svg";
import shape12 from "@/assets/shape12.svg";
import shape13 from "@/assets/shape13.svg";

export default function DashboardPage() {
  const statCards = [
    { label: "Point", value: "300", color: "#38BDF8" },
    { label: "Durasi Belajar", value: "4 jam", color: "#FB923C" },
    { label: "Upcoming", value: "300", color: "#F472B6" },
    { label: "Upcoming", value: "300", color: "#FACC15" },
  ];

  const mentoringSessions = [
    {
      id: 1,
      time: "3:30pm",
      title: "[Mandatory] Coding Camp 2026 - Sesi Financial Literacy #1",
      url: "https://www.youtube.com/watch?v=slsPQBrWvfY",
      status: "In Progress",
      color: "#FACC15",
      badgeColor: "#10B981",
    },
    {
      id: 2,
      time: "3:30pm",
      title: "[Mandatory] Coding Camp 2026 - Sesi Financial Literacy #1",
      url: "https://www.youtube.com/watch?v=slsPQBrWvfY",
      status: "Tomorrow",
      color: "#38BDF8",
      badgeColor: "#3B82F6",
    },
    {
      id: 3,
      time: "3:30pm",
      title: "[Mandatory] Coding Camp 2026 - Sesi Financial Literacy #1",
      url: "https://www.youtube.com/watch?v=slsPQBrWvfY",
      status: "Decline",
      color: "#FB923C",
      badgeColor: "#EF4444",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className={styles.contentFlex}>
        {/* Welcome Banner */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={styles.banner}
        >
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>
              Hi, Alyssa <span role="img" aria-label="wave">👋</span>
            </h2>
            <p className={styles.bannerSub}>ready to learn, grow, and explore more</p>
            <div className={styles.bannerButtons}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.bannerBtn}
              >
                Learn <div className={styles.bannerBtnArrow}>˃</div>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.bannerBtn}
              >
                Teach <div className={styles.bannerBtnArrow}>˃</div>
              </motion.button>
            </div>
          </div>
          <div className={styles.bannerDecor}>
            {[shape10, shape11, shape12, shape13].map((shape, i) => (
              <motion.img 
                key={i}
                animate={{ y: [0, -(10 + i * 2), 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                src={shape} alt="mascot" className={styles.mascot} 
              />
            ))}
          </div>
        </motion.section>

        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={styles.statCard}
              style={{ backgroundColor: card.color }}
            >
              <div className={styles.statLabel}>{card.label}</div>
              <div className={styles.statValue}>{card.value}</div>
            </motion.div>
          ))}
        </section>

        {/* Mentoring Section */}
        <section className={styles.mentoringSection}>
          <div className={styles.sectionHeader}>
            <h2>Mentoring session</h2>
            <span className={styles.seeAll}>See all</span>
          </div>
          <div className={styles.mentoringList}>
            {mentoringSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className={styles.mentoringItem}
                style={{ backgroundColor: session.color }}
              >
                <div className={styles.itemContent}>
                  <div className={styles.itemIcon}></div>
                  <div className={styles.itemText}>
                    <span className={styles.itemTitle}>{session.time} {session.title}</span>
                    <a href={session.url} className={styles.itemUrl} target="_blank" rel="noreferrer">
                      {session.url}
                    </a>
                  </div>
                </div>
                <div 
                  className={styles.statusBadge}
                  style={{ backgroundColor: session.badgeColor }}
                >
                  {session.status}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
