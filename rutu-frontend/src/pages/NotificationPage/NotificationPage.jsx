import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./NotificationPage.module.css";

export default function NotificationPage() {
  const notifications = [
    { id: 1, name: "Grace Ashcroft", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "13.47", color: "#F472B6" },
    { id: 2, name: "RuangTumbuh", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "13.10", color: "#38BDF8" },
    { id: 3, name: "RuangTumbuh", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "13.00", color: "#FACC15" },
    { id: 4, name: "Grace Ashcroft", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "13.00", color: "#FB923C" },
    { id: 5, name: "Grace Ashcroft", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "Yesterday", color: "#38BDF8" },
    { id: 6, name: "Grace Ashcroft", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "Yesterday", color: "#FACC15" },
    { id: 7, name: "Grace Ashcroft", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "Yesterday", color: "#F472B6" },
    { id: 8, name: "Grace Ashcroft", message: "Your study schedule with Grace Ashcroft has been set. Please check the latest schedule.", time: "Yesterday", color: "#38BDF8" },
  ];

  return (
    <DashboardLayout title="Notification">
      <div className={styles.container}>
        <div className={styles.notificationList}>
          {notifications.map((notif, idx) => (
            <motion.div 
              key={notif.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={styles.notificationItem}
            >
              <div 
                className={styles.colorBox} 
                style={{ border: `3px solid ${notif.color}`, color: notif.color }}
              >
                {/* Square icon mapping the image */}
                <div className={styles.innerSquare} style={{ backgroundColor: 'transparent', border: `2px solid ${notif.color}` }}></div>
              </div>
              <div className={styles.content}>
                <span className={styles.name}>{notif.name}</span>
                <p className={styles.message}>{notif.message}</p>
              </div>
              <span className={styles.time}>{notif.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
