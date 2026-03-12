import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
import logoGede from '../../assets/logo.svg'; 

export default function Login() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div className={styles.fullPage}>
      {/* Kursor Custom */}
      <div className={styles.cursor} style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }}>✦</div>

      <div className={styles.loginCard}>
        {/* SISI KIRI: BRANDING */}
        <div className={styles.leftSide}>
          <img src={logoGede} alt="Logo" className={styles.mainLogo} />
          <p className={styles.brandText}>
            Lorem ipsum dolor sit amet makan udang enak lorem ipsum
          </p>
        </div>

        {/* SISI KANAN: FORM LOGIN */}
        <div className={styles.rightSide}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Welcome Back! 👋</h1>
            <p className={styles.subtitle}>Sign in to your Gmail or Email account</p>
          </div>

          <button className={styles.btnGoogle} type="button">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" />
            Continue with Google
          </button>

          <div className={styles.divider}>
            <span>or use Email Address</span>
          </div>

          <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email / Gmail" className={styles.inputField} required />
            <input type="password" placeholder="Password" className={styles.inputField} required />
            
            <div className={styles.options}>
              <a href="#forgot" className={styles.forgot}>Forgot password?</a>
            </div>

            <button type="submit" className={styles.btnSignIn}>Sign In</button>
          </form>

          <p className={styles.footer}>
            Don't have an account? <Link to="/register" className={styles.linkRegister}>Register here</Link>
          </p>
        </div>
      </div>

      {/* Dekorasi Bintang di luar kartu */}
      <div className={`${styles.bgStar} ${styles.star1}`}>✦</div>
      <div className={`${styles.bgStar} ${styles.star2}`}>✦</div>
    </div>
  );
}