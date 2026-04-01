import React from "react";
import styles from "./DashboardTopbar.module.css";
import { CiLight } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";

export default function DashboardTopbar({ title, onMenuClick }) {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userName = user ? user.name : "Pengguna";
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.titleGroup}>
          <h1>{title}</h1>
        </div>
      </div>
      <div className={styles.navButtonsContainer}>
        <div className={styles.navItems}>
          <IoIosNotificationsOutline className={styles.navItem} role="button" />
          <IoIosAddCircleOutline className={styles.navItem} role="button" />
          <CiLight
            className={`${styles.navItem} ${styles.setThickness}`}
            role="button"
          />
        </div>
        <button className={styles.profileBtn}>
          <div className={styles.avatar}>
            <FaUser className={styles.guestIcon} />
          </div>
          <span className={styles.userName}>{userName}</span>
        </button>
      </div>
    </header>
  );
}
