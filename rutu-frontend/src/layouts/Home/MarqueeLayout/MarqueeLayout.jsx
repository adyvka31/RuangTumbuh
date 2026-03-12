import React from "react";
import styles from "./MarqueeLayout.module.css";

export default function MarqueeSection() {
  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeContainer}>
        {[1, 2].map((group) => (
          <div key={group} className={styles.marqueeContent}>
            {[1, 2, 3].map((text) => (
              <span key={text} className={styles.marqueeText}>
                RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
