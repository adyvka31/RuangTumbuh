import React from "react";
import { Link } from "react-router-dom";
import styles from "./AuthLayout.module.css";
import logoGede from "@assets/logo.svg";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.fullPage}>
      <div className={styles.authCard}>
        {/* SISI KIRI (Hanya ditulis 1 kali di sini, dipakai di Login & Register) */}
        <div className={styles.leftSide}>
          <Link to="/" className={styles.mainLogo}>
            <img src={logoGede} alt="Logo" className={styles.mainLogo} />
          </Link>
          <p className={styles.brandText}>
            Temukan Ruang untuk Terus Tumbuh dan Berkembang Bersama Kami.
          </p>
        </div>

        {/* SISI KANAN (Tempat form Login atau Register disuntikkan) */}
        <div className={styles.rightSide}>{children}</div>
      </div>

      <div className={`${styles.bgStar} ${styles.star1}`} aria-hidden="true">
        ✦
      </div>
      <div className={`${styles.bgStar} ${styles.star2}`} aria-hidden="true">
        ✦
      </div>
    </div>
  );
}
