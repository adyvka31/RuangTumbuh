import React from "react";
import { motion } from "framer-motion";
import { SCHEDULE_POINTS } from "@/constants/calendarData";
import { useCalendarScroll } from "@/hooks/useCalendarScroll";
import Calendar from "./Calendar";
import TimelineItem from "./TimelineItem";
import HeaderLayout from "@layouts/HeaderLayout/HeaderLayout";
import styles from "./CalendarSection.module.css";
import shape9 from "@assets/shape9.svg";

export default function CalendarSection() {
  const { containerRef, rotate } = useCalendarScroll();

  return (
    <main className={styles.main} ref={containerRef} id="kalender">
      {/* KIRI: KALENDER */}
      <div className={styles.leftSection}>
        <img
          src={shape9}
          alt=""
          loading="lazy"
          aria-hidden="true"
          className={styles.decorShape9}
        />

        <motion.div style={{ rotate, position: "relative", zIndex: 2 }}>
          <Calendar />
        </motion.div>
      </div>

      {/* KANAN: TEKS FITUR */}
      <div className={styles.rightSection}>
        <section className={styles.section}>
          <HeaderLayout
            tag="Feature Spotlight"
            title="Integrated Schedule"
            desc="Kuasai waktumu dengan antarmuka kalender built-in kami. Didesain untuk fokus, dibangun untuk kecepatan, dan bikin perencanaan harian jadi pengalaman visual yang seru, bukan beban."
            tagColor="var(--primary-yellow)"
          />

          <div className={styles.timelineContainer}>
            {SCHEDULE_POINTS.map((point, index) => (
              <TimelineItem
                key={index}
                point={point}
                isLast={index === SCHEDULE_POINTS.length - 1}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
