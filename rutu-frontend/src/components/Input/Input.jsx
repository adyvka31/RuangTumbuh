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
  isTextarea, 
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        {isTextarea ? (
          <textarea
            className={`${styles.inputForm} ${errorMessage ? styles.error : ""}`}
            id={id}
            name={name}
            placeholder=" "
            value={value}
            onChange={onChange}
            style={{
              resize: "vertical",
              minHeight: "120px",
              lineHeight: "1.6",
            }} 
            {...props}
          />
        ) : (
          <input
            className={`${styles.inputForm} ${errorMessage ? styles.error : ""}`}
            type={inputType}
            id={id}
            name={name}
            placeholder=" "
            value={value}
            onChange={onChange}
            {...props}
          />
        )}

        <label htmlFor={id} className={styles.floatingLabel}>
          {label}
        </label>

        {isPassword && !isTextarea ? (
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
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
};
