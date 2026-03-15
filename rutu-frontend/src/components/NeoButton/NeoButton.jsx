import React from "react";
import styles from "./NeoButton.module.css";

export default function NeoButton({
  children,
  color = "var(--primary-yellow)",
  ...props
}) {
  return (
    <button
      className={styles.btnNeo}
      style={{ backgroundColor: color }}
      {...props}
    >
      {children}
    </button>
  );
}
