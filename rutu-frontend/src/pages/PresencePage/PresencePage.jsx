import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./PresencePage.module.css";
import shape4 from "@assets/shape4.svg";
import shape7 from "@assets/shape7.svg";
import { Popup } from "@/components/Popup/Popup";
import { FiCheckCircle } from "react-icons/fi";

export default function PresencePage() {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setShowPopup(true);
      setIsSubmitting(false);
      setToken("");
    }, 1500);
  };

  return (
    <DashboardLayout title="Presensi Kelas">
      <div className={styles.container}>
        <img src={shape4} className={styles.decor1} alt="" />
        <img src={shape7} className={styles.decor2} alt="" />

        <div className={styles.contentWrapper}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.textSection}
          >
            <h1 className={styles.title}>Attendance <span className={styles.highlight}>Check</span></h1>
            <p className={styles.description}>
              Pastikan kehadiran partisipan di kelasmu tercatat dengan benar. 
              Masukkan token kelas yang valid untuk memulai sesi presensi.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.formSection}
          >
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Informasi Kelas</label>
                <div className={styles.classCard}>
                  <div className={styles.classIcon}>🎓</div>
                  <div className={styles.classDetails}>
                    <h3 className={styles.className}>Frontend Mastery: React Hook</h3>
                    <p className={styles.classMeta}>Mentor: Alyssa Jane • 18 Maret 2026</p>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="token" className={styles.label}>Token Presensi</label>
                <input 
                  id="token"
                  type="text" 
                  placeholder="Masukkan 6 Digit Token" 
                  className={styles.input}
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, x: 5, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit Presensi ✨"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <Popup
        isOpen={showPopup}
        type="success"
        icon={<FiCheckCircle />}
        title="Presensi Tercatat! ✅"
        description="Kehadiranmu berhasil dicatat. Selamat mengikuti kelas!"
        buttonText="OK, Mengerti"
        onAction={() => setShowPopup(false)}
      />
    </DashboardLayout>
  );
}
