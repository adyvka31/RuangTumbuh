import React from "react";
import { motion } from "framer-motion";
import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import styles from "./CalendarSection.module.css";

export default function TimelineItem({ point, isLast }) {
  const { itemRef, scrollYProgress } = useTimelineProgress();

  return (
    <div ref={itemRef} className={styles.timelineItem}>
      <div className={styles.timelineDivider}>
        <div
          className={styles.timelineDot}
          style={{ backgroundColor: point.color }}
        />

        {!isLast && (
          <div className={styles.timelineLineTrack}>
            <motion.div
              className={styles.timelineLineFill}
              style={{
                scaleY: scrollYProgress,
                backgroundColor: point.color,
              }}
            />
          </div>
        )}
      </div>

      <div className={styles.timelineContent}>
        <h2 className={styles.pointTitle}>{point.title}</h2>
        <p className={styles.pointDesc}>{point.desc}</p>
      </div>
    </div>
  );
}
