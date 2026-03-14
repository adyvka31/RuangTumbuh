import React from "react";
import { Link } from "react-router-dom";
import styles from "./LoginPage.module.css";
import logoGede from "@assets/logo.svg";

export default function Login() {

  return (
    <>
      <div className={styles.fullPage}>
        <div className={styles.loginCard}>
          {/* SISI KIRI: BRANDING */}
          <div className={styles.leftSide}>
            <Link to="/" className={styles.mainLogo} ><img src={logoGede} alt="Logo" className={styles.mainLogo} /></Link>
            <p className={styles.brandText}>
              Temukan Ruang untuk Terus Tumbuh dan Berkembang Bersama Kami.
            </p>
          </div>

          {/* SISI KANAN: FORM LOGIN */}
          <div className={styles.rightSide}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Welcome Back! 👋</h1>
              <p className={styles.subtitle}>
                Sign in to your account
              </p>
            </div>

            <form
              className={styles.loginForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email / Gmail"
                className={styles.inputField}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.inputField}
                required
              />

              <div className={styles.options}>
                <a href="#forgot" className={styles.forgot}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className={styles.btnSignIn}>
                Sign In
              </button>
            </form>

            <p className={styles.footer}>
              Don't have an account?{" "}
              <Link to="/register" className={styles.linkRegister}>
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Dekorasi Bintang di luar kartu */}
        <div className={`${styles.bgStar} ${styles.star1}`}>✦</div>
        <div className={`${styles.bgStar} ${styles.star2}`}>✦</div>
      </div>
    </>
  );
}

