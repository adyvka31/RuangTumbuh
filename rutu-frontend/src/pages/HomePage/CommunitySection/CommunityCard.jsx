import React from "react";
import styles from "./CommunitySection.module.css";

export default function CommunityCard({ feat, index }) {
  return (
    <div className={styles.featureCard}>
      <div
        className={styles.cardIndicator}
        style={{ backgroundColor: feat.color }}
      />
      <div className={styles.cardContent}>
        <h3>{feat.title}</h3>
        <p>{feat.desc}</p>
      </div>
    </div>
  );
}
