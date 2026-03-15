import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@layouts/AuthLayout/AuthLayout";
import NeoInput from "@components/NeoInput/NeoInput";
import NeoButton from "@components/NeoButton/NeoButton";
import styles from "./LoginPage.module.css";

export default function Login() {
  return (
    <AuthLayout>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Welcome Back! 👋</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>

      <form className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
        {/* Memakai komponen UI yang reusable */}
        <NeoInput type="email" placeholder="Email / Gmail" required />
        <NeoInput type="password" placeholder="Password" required />

        <div className={styles.options}>
          <a href="#forgot" className={styles.forgot}>
            Forgot password?
          </a>
        </div>

        <NeoButton type="submit" color="var(--primary-green)">
          Sign In
        </NeoButton>
      </form>

      <p className={styles.footer}>
        Don't have an account?{" "}
        <Link to="/register" className={styles.linkRegister}>
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}
