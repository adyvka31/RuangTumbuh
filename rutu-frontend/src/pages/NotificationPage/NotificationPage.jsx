import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./NotificationPage.module.css";
import { DUMMY_NOTIFICATIONS } from "@/constants/notificationDummy";

export default function NotificationPage() {
  return (
    <DashboardLayout title="Notification">
      <div className={styles.container}>
        <div className={styles.notificationList}>
          {DUMMY_NOTIFICATIONS.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={styles.notificationItem}
            >
              <div
                className={styles.colorBox}
                style={{
                  border: `3px solid ${notif.color}`,
                  color: notif.color,
                }}
              >
                {/* Square icon mapping the image */}
                <div
                  className={styles.innerSquare}
                  style={{
                    backgroundColor: "transparent",
                    border: `2px solid ${notif.color}`,
                  }}
                ></div>
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
