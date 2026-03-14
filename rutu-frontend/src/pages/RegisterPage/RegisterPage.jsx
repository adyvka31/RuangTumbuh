import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import logoGede from '@assets/logo.svg';

export default function Register() {
  return (
    <>
      <div className={styles.fullPage}>
        <div className={styles.registerCard}>
          {/* SISI KIRI: BRANDING */}
          <div className={styles.leftSide}>
            <Link to="/" className={styles.mainLogo} ><img src={logoGede} alt="Logo" className={styles.mainLogo} /></Link>
            <p className={styles.brandText}>
              Temukan Ruang untuk Terus Tumbuh dan Berkembang Bersama Kami.
            </p>
          </div>

          {/* SISI KANAN: FORM REGISTER */}
          <div className={styles.rightSide}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Create Account 🚀</h1>
              <p className={styles.subtitle}>Enter your details to register</p>
            </div>

            <form className={styles.registerForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <input type="email" placeholder="Email / Gmail" className={styles.inputField} required />
                <input type="text" placeholder="Username" className={styles.inputField} required />
              </div>

              <div className={styles.inputGroup}>
                <input type="password" placeholder="Password" className={styles.inputField} required />
                <input type="password" placeholder="Confirm Password" className={styles.inputField} required />
              </div>

              <button type="submit" className={styles.btnRegister}>
                Register Now
              </button>
            </form>

            <p className={styles.footer}>
              Already have an account?{" "}
              <Link to="/login" className={styles.linkRegister}>
                Login here
              </Link>
            </p>

          </div>
        </div>

        {/* Dekorasi Bintang Background */}
        <div className={`${styles.bgStar} ${styles.star1}`}>✦</div>
        <div className={`${styles.bgStar} ${styles.star2}`}>✦</div>
      </div>
    </>
  );
}
