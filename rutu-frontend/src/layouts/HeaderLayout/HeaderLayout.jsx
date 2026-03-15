import React from "react";
import styles from "./HeaderLayout.module.css";

export default function HeaderLayout({ tag, title, desc, tagColor = "var(--primary-yellow)" }) {
  return (
    <div className={styles.headerArea}>
      {tag && (
        <span className={styles.tag} style={{ background: tagColor }}>
          {tag}
        </span>
      )}
      <h1 className={styles.heroTitle}>{title}</h1>
      <p className={styles.heroDesc}>{desc}</p>
    </div>
  );
}