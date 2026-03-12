import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import logoGede from '../../assets/logo.svg'; 

export default function Register() {
  return (
    <div className={styles.fullPage}>
      <div className={styles.registerCard}>
        {/* SISI KIRI: BRANDING */}
        <div className={styles.leftSide}>
          <img src={logoGede} alt="Logo" className={styles.mainLogo} />
          <p className={styles.brandText}>
            Join us today! Start your journey and grow with Ruang Tumbuh.
          </p>
          <div className={styles.backToLogin}>
            <span>Already have an account?</span>
            <Link to="/login" className={styles.linkLogin}>Login here</Link>
          </div>
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

          <div className={styles.divider}>
            <span>or join with</span>
          </div>

          <button className={styles.btnGoogle} type="button">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" />
            Sign up with Google
          </button>
        </div>
      </div>

      {/* Dekorasi Bintang Background */}
      <div className={`${styles.bgStar} ${styles.star1}`}>✦</div>
      <div className={`${styles.bgStar} ${styles.star2}`}>✦</div>
    </div>
  );
}