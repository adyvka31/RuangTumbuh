import React from "react";
import styles from "./Popup.module.css";

export const Popup = ({
  isOpen,
  icon,
  title,
  description,
  buttonText,
  onAction,
  secondaryButtonText,
  onSecondaryAction,
  type = "success",
}) => {
  if (!isOpen) return null;

  // Menentukan class warna berdasarkan tipe
  const iconColorClass =
    type === "danger" ? styles.iconDanger : styles.iconSuccess;

  const buttonColorClass =
    type === "danger" ? styles.actionBtnDanger : styles.actionBtnSuccess;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={`${styles.iconCircle} ${iconColorClass}`}>{icon}</div>
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.buttonGroup}>
          {secondaryButtonText && (
            <button className={styles.cancelBtn} onClick={onSecondaryAction}>
              {secondaryButtonText}
            </button>
          )}
          <button className={buttonColorClass} onClick={onAction}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
