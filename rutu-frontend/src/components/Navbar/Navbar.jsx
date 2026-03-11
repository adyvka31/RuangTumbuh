import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.svg"; // Sesuaikan path jika berbeda

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <a href="#home">HOME</a>
          <a href="#find_tutor">LEARN & TEACH</a>
          <a href="#calendar">CALENDAR</a>
          <a href="#session">SESSION</a>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.right}>
          <a href="#signin">SIGN IN</a>
          <button className={styles.button}>GET STARTED</button>
        </div>
      </nav>

      <div className={`${styles.dashboard}`}>
        <img src={logo} alt="Logo RuangTumbuh" />
      </div>
    </div>
  );
}
