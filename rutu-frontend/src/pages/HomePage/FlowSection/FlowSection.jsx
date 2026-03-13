import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./FlowSection.module.css";

const FLOW_DATA = [
  {
    id: 1,
    title: "Cari Skill & Tutor",
    desc: "Gak usah pusing sendirian! Cari mentor yang sesuai dengan minatmu atau buka kelas untuk membagikan keahlianmu ke komunitas.",
    color: "#ff9f43",
  },
  {
    id: 2,
    title: "Pilih Jadwal & Durasi",
    desc: "Kalender otomatis yang jagain jadwal kamu. Sesuaikan waktu belajar dengan kesibukanmu tanpa perlu takut bentrok.",
    color: "#ffd400",
  },
  {
    id: 3,
    title: "Live Session",
    desc: "Lakukan sesi mentoring secara interaktif. Diskusi langsung, screen sharing, dan praktik bareng mentor pilihanmu.",
    color: "#ff6ea8",
  },
  {
    id: 4,
    title: "Feedback & Selesai",
    desc: "Berikan ulasan, kumpulkan lencana, dan pantau terus perkembangan skill-mu lewat dashboard portofolio.",
    color: "#00f2fe",
  },
];

export default function FlowSection() {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className={styles.scrollWrapper} ref={scrollRef}>
      <section className={styles.section}>
        {/* --- BACKGROUND BIRU DENGAN POLA ACAK PURE CSS --- */}
        <div className={styles.blueBottom}>
          {/* Lapis 1: Pola Grid Titik-titik */}
          <div className={styles.patternGrid}></div>

          {/* Lapis 2: Pola Simbol Acak Melayang */}
          <div className={`${styles.randomSymbol} ${styles.symbol1}`}>+</div>
          <div className={`${styles.randomSymbol} ${styles.symbol2}`}>○</div>
          <div className={`${styles.randomSymbol} ${styles.symbol3}`}>✖</div>
          <div className={`${styles.randomSymbol} ${styles.symbol4}`}>〰</div>
          <div className={`${styles.randomSymbol} ${styles.symbol5}`}>∆</div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Alur Belajar</h2>
            <p className={styles.subtitle}>
              Langkah mudah untuk mulai belajar, mengajar, dan berbagi skill
              dengan yang lain.
            </p>
          </div>

          <div className={styles.cardContainer}>
            {FLOW_DATA.map((item, index) => {
              const sStart = index * 0.25;
              const sEnd = sStart + 0.2;
              const y = useTransform(scrollYProgress, [sStart, sEnd], [250, 0]);

              const opacity = useTransform(
                scrollYProgress,
                [sStart, sEnd],
                [0, 1],
              );

              const scale = useTransform(
                scrollYProgress,
                [sStart, sEnd],
                [0.8, 1],
              );

              return (
                <motion.div
                  key={item.id}
                  className={styles.card}
                  style={{ y, opacity, scale }}
                  whileHover={{
                    top: "-15px",
                    boxShadow: "15px 15px 0px #000",
                    transition: { duration: 0.2, type: "tween" },
                  }}
                >
                  <div
                    className={styles.semiCircle}
                    style={{ backgroundColor: item.color }}
                  >
                  </div>

                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
