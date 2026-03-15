import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@layouts/AuthLayout/AuthLayout";
import NeoInput from "@components/NeoInput/NeoInput";
import NeoButton from "@components/NeoButton/NeoButton";
import styles from "./RegisterPage.module.css";

export default function Register() {
  return (
    <AuthLayout>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>Create Account 🚀</h1>
        <p className={styles.subtitle}>Enter your details to register</p>
      </div>

      <form
        className={styles.registerForm}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles.inputGroup}>
          <NeoInput type="email" placeholder="Email / Gmail" required />
          <NeoInput type="text" placeholder="Username" required />
        </div>

        <div className={styles.inputGroup}>
          <NeoInput type="password" placeholder="Password" required />
          <NeoInput type="password" placeholder="Confirm Password" required />
        </div>

        {/* Menggunakan NeoButton dengan warna kuning */}
        <NeoButton type="submit" color="var(--primary-yellow)">
          Register Now
        </NeoButton>
      </form>

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link to="/login" className={styles.linkRegister}>
          Login here
        </Link>
      </p>
    </AuthLayout>
  );
}
