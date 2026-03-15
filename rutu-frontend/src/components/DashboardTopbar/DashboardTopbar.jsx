import React from "react";
import styles from "./DashboardTopbar.module.css";

export default function DashboardTopbar({ title, onMenuClick }) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <button className={styles.mobileNavToggle} onClick={onMenuClick}>
          ☰
        </button>
        <div className={styles.titleGroup}>
          <h1>{title}</h1>
          <p>Monday, 12 Januari 2026</p>
        </div>
      </div>
      <div className={styles.topBarRight}>
        <button className={styles.iconBtn} aria-label="Messages">✉</button>
        <button className={styles.iconBtn} aria-label="Notifications">🔔</button>
        <div className={styles.avatar}>AJ</div>
      </div>
    </header>
  );
}
