import React from "react";
import styles from "./DashboardTopbar.module.css";
import { Link } from "react-router-dom";

export default function DashboardTopbar({ title, onMenuClick }) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <button className={styles.mobileNavToggle} onClick={onMenuClick}>
          ☰
        </button>
        <div className={styles.titleGroup}>
          <h1>{title}</h1>
        </div>
      </div>
      <div className={styles.topBarRight}>
        <Link to="/notifications" className={styles.iconBtn} aria-label="Notifications">🔔</Link>
        <div className={styles.avatar}>AJ</div>
      </div>
    </header>
  );
}
