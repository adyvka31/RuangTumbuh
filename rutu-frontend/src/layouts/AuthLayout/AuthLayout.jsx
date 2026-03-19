import styles from "./AuthLayout.module.css";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

// Component reusable untuk Login dan Register
export const AuthLayout = ({
  title,
  description,
  children,
  linkText,
  linkTo,
  linkActionText,
  reverse = false, // Untuk membedakan beberapa posisi login & register (Container, Shape)
}) => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgPattern}></div>
      
      <div
        className={`${styles.authContainer} ${reverse ? styles.reverse : ""}`}
      >
        <div className={styles.containerImage}></div>
        <div className={styles.containerForm}>
          <div
            className={`${styles.decorativeShape} ${reverse ? styles.shapeTopRegister : styles.shapeTopLogin}`}
          ></div>
          <div
            className={`${styles.decorativeShape} ${reverse ? styles.shapeBottomRegister : styles.shapeBottomLogin}`}
          ></div>

          <img src={logo} alt="Logo Ruang Tumbuh" className={styles.logo} />

          <h1 className={styles.titleForm}>{title}</h1>
          <p className={styles.descForm}>{description}</p>

          {children}

          <div className={styles.footerLink}>
            {linkText} <Link to={linkTo}>{linkActionText}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
