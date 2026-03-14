import React from "react";
import { motion } from "framer-motion";
import { useFlowAnimation } from "@/hooks/useFlowAnimation";
import styles from "./FlowSection.module.css";

export default function FlowCard({ item, index, scrollYProgress }) {
  // Panggil logika animasi dari custom hook
  const { y, opacity, scale } = useFlowAnimation(scrollYProgress, index);

  return (
    <motion.div
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
        <span className={styles.stepNumber}>0{index + 1}</span>
      </div>

      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardDesc}>{item.desc}</p>
    </motion.div>
  );
}
