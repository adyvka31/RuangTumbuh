import React from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import { TEXT_LOGO, SHAPES_CONFIG } from "@/constants/heroData";
import styles from "./HeroLayout.module.css";

export default function HeroSection() {
  const { motionValues, yText } = useParallax();

  return (
    <section className={styles.hero} id="beranda">
      <div className={styles.parallaxContainer}>
        {SHAPES_CONFIG.map((shape, index) => (
          <motion.div
            key={shape.id}
            style={{
              y: motionValues[shape.moveY],
              x: motionValues[shape.moveX],
              willChange: "transform",
            }}
            // 1. ANIMASI SHAPE: Muncul dari titik pusat (scale 0) ke ukuran asli (scale 1)
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 15,
              // Delay dibuat bertingkat agar shape muncul bergantian layaknya efek popcorn
              delay: 0.3 + index * 0.01,
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

        {/* 2. ANIMASI TEKS LOGO: Muncul melayang dari bawah */}
        <motion.div
          style={{ y: yText }}
          className={styles.content}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            bounce: 0.4,
            delay: 0.2,
          }}
        >
          <img
            src={TEXT_LOGO}
            alt="Ruang Tumbuh Logo"
            className={styles.textLogo}
            fetchPriority="high"
          />
          <p className={styles.subtitle}>Learn, Grow, and Explore Together</p>
        </motion.div>
      </div>
    </section>
  );
}
