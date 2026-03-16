import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MessagesPage.module.css";

export default function MessagesPage() {
  const messages = [
    { id: 1, name: "Grace Ashcroft", text: "ayo masuk ke ke zoom meetingnya", time: "12.30", color: "#38BDF8" },
    { id: 2, name: "Carloz", text: "Pe, info mabar", time: "11.30", color: "#FB923C" },
    { id: 3, name: "Ashly", text: "p, udanh ngerjain tugasnya?", time: "10.30", color: "#F472B6" },
    { id: 4, name: "donatur", text: "p", time: "08.30", color: "#FACC15" },
    { id: 5, name: "Leonor", text: "ikut kelasnya ga ???", time: "08.30", color: "#38BDF8" },
    { id: 6, name: "Chris redfield", text: "Mau catatanya donk", time: "09.30", color: "#FB923C" },
    { id: 7, name: "Leon scott", text: "p", time: "06.30", color: "#F472B6" },
  ];

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout title="Message">
      <div className={styles.container}>
        <div className={styles.header}>
            <p className={styles.date}>{currentDate}</p>
        </div>
        <div className={styles.messageList}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={styles.messageItem}
              style={{ backgroundColor: msg.color }}
            >
              <div className={styles.avatar}></div>
              <div className={styles.textGroup}>
                <span className={styles.name}>{msg.name}</span>
                <p className={styles.text}>{msg.text}</p>
              </div>
              <span className={styles.time}>{msg.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
