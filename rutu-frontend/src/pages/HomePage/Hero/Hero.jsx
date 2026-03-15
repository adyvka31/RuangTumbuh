import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import { TEXT_LOGO, SHAPES_CONFIG } from "@/constants/heroData";
import styles from "./HeroLayout.module.css";

export default function HeroSection() {
  const { motionValues, yText } = useParallax();

  return (
    <section className={styles.hero} id="beranda">
      <div className={styles.parallaxContainer}>
        {SHAPES_CONFIG.map((shape) => (
          <motion.div
            key={shape.id}
            style={{
              y: motionValues[shape.moveY],
              x: motionValues[shape.moveX],
            }}
            className={`${styles.shapeWrapper} ${styles[shape.z]} ${styles[shape.cName]}`}
          >
            <div
              style={{
                animation: `floatShapeCSS ${shape.dur}s ease-in-out infinite`,
                width: "100%",
                height: "100%",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={shape.src}
                style={{ transform: `rotate(${shape.rot}deg)` }}
                className={styles.shapeImg}
                alt=""
                aria-hidden="true"
              />
            </div>
          </motion.div>
        ))}

        <motion.div style={{ y: yText }} className={styles.content}>
          <img
            src={TEXT_LOGO}
            alt="Ruang Tumbuh Logo"
            className={styles.textLogo}
            fetchpriority="high"
          />
          <p className={styles.subtitle}>Learn, Grow, and Explore Together</p>
        </motion.div>
      </div>
    </section>
  );
}
