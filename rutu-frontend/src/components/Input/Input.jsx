import styles from "./Input.module.css";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Input = ({
  type,
  id,
  name,
  label,
  icon: Icon,
  errorMessage,
  value,
  onChange,
}) => {
  // State untuk melacak apakah password ditampilkan atau tidak
  const [showPassword, setShowPassword] = useState(false);

  // Mengecek apakah type nya password
  const isPassword = type === "password";

  // Tentukan type yang akan dirender ke layar (berubah jadi "text" jika mata di klik)
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.inputForm} ${errorMessage ? styles.error : ""}`}
          type={inputType}
          id={id}
          name={name}
          placeholder=" "
          value={value}
          onChange={onChange}
        />
        <label htmlFor={id} className={styles.floatingLabel}>
          {label}
        </label>
        {isPassword ? (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <FiEyeOff className={styles.inputIconClickable} />
            ) : (
              <FiEye className={styles.inputIconClickable} />
            )}
          </button>
        ) : (
          Icon && <Icon className={styles.inputIcon} />
        )}
      </div>
      {/* Pesan error */}
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
};
