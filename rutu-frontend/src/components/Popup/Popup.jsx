import { memo } from "react";
import styles from "./Popup.module.css";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";

export const Popup = memo(
  ({ isOpen, icon, title, description, buttonText, onAction }) => {
    if (!isOpen) return null;

    return createPortal(
      <div className={styles.overlay}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <div className={styles.iconCircle}>{icon}</div>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.buttonWrapper}>
            <Button onClick={onAction} type="button">
              {buttonText}
            </Button>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);
