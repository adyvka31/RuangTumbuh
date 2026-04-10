import styles from "./Input.module.css";
import React, { useState, forwardRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Input = forwardRef(
  (
    {
      type,
      id,
      name,
      label,
      icon: Icon,
      errorMessage,
      value,
      onChange,
      isTextarea,
      isSelect, // Tambahkan prop isSelect
      options = [], // Tambahkan prop options untuk dropdown
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          {isSelect ? ( // Logika untuk merender select
            <select
              ref={ref}
              className={`${styles.inputForm} ${errorMessage ? styles.error : ""}`}
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              {...props}
            >
              <option value="" disabled hidden></option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : isTextarea ? (
            <textarea
              ref={ref}
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
              ref={ref}
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

          {/* ... sisa kode toggle password dan icon ... */}
          {isPassword && !isTextarea && !isSelect ? (
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
  },
);

Input.displayName = "Input";
