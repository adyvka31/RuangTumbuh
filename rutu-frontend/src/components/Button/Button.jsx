import { memo } from "react";
import styles from "./Button.module.css";

export const Button = memo(
  ({
    children,
    type = "button",
    onClick,
    id,
    disabled = false,
    btnWidth = "100%",
    btnHeight = "16px",
  }) => {
    return (
      <button
        style={{ width: btnWidth, padding: btnHeight }}
        className={styles.button}
        onClick={onClick}
        id={id}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  },
);
