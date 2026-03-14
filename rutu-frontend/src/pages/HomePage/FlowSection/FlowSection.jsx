import React from "react";
import { useSequentialScroll } from "@/hooks/useSequentialScroll";
import { FLOW_DATA } from "@/constants/flowData";
import FlowCard from "./FlowCard";
import styles from "./FlowSection.module.css";

export default function FlowSection() {
  // Panggil tracking scroll menggunakan hook yang sudah Anda buat sebelumnya
  const { scrollRef, scrollYProgress } = useSequentialScroll();

  return (
    <div className={styles.scrollWrapper} ref={scrollRef} id="alur">
      <section className={styles.section}>
        <div className={styles.blueBottom}>
          <div className={styles.patternGrid}></div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Alur Pembelajaran</h2>
            <p className={styles.subtitle}>
              Langkah mudah untuk mulai belajar, mengajar, dan berbagi skill
              dengan yang lain.
            </p>
          </div>

          <div className={styles.cardContainer}>
            {FLOW_DATA.map((item, index) => (
              <FlowCard
                key={item.id}
                item={item}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
