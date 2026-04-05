import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./LoginForm.module.css";
import { FiAtSign, FiLock } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { Popup } from "@components/Popup/Popup";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {error && (
          <p style={{ color: "red", fontWeight: "bold", marginBottom: "10px", marginTop: "-15px" }}>
            {error}
          </p>
        )}

        <div className={styles.inputFormGroup}>
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            icon={FiAtSign}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            icon={FiLock}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className={styles.passwordActionsForm}>
            <div className={styles.rememberMeGroup}>
              <input type="checkbox" name="Rememberme" id="rememberme" />
              <label htmlFor="rememberme">Ingatkan Saya</label>
            </div>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Lupa Password
            </Link>
          </div>
        </div>

        <Button type="submit">{isLoading ? "Loading..." : "Login"}</Button>
      </form>

      {showPopup && (
        <Popup
          isOpen={true}
          icon={<MdCheckCircle />}
          title="Login Berhasil!"
          description="Selamat datang kembali! Sedang mengalihkan ke Dashboard..."
          buttonText="Pergi Ke Dashboard"
          onAction={() => navigate("/dashboard")}
        />
      )}
    </>
  );
};
