import React from "react";
import styles from "./NeoInput.module.css";

export default function NeoInput({ ...props }) {
  return <input className={styles.inputField} {...props} />;
}
