import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.svg"; // Sesuaikan path jika berbeda

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // 1. Tambahkan state untuk mendeteksi apakah menu mobile sedang terbuka
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 2. Buat fungsi untuk membalik (toggle) state isMenuOpen
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi tambahan: Tutup menu otomatis jika link diklik
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.navbar}>
        {/* Hamburger Button (hanya muncul di mobile) */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
          ></span>
          <span
            className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
          ></span>
          <span
            className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
          ></span>
        </button>

        {/* --- DESKTOP MENU --- */}
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

        <div
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}
        >
          <a href="#home" onClick={closeMenu}>
            HOME
          </a>
          <a href="#find_tutor" onClick={closeMenu}>
            LEARN & TEACH
          </a>
          <a href="#calendar" onClick={closeMenu}>
            CALENDAR
          </a>
          <a href="#session" onClick={closeMenu}>
            SESSION
          </a>

          <div className={styles.mobileMenuDivider}></div>

          <a href="#signin" onClick={closeMenu}>
            SIGN IN
          </a>
          <button className={styles.button} onClick={closeMenu}>
            GET STARTED
          </button>
        </div>
      </nav>

      <div className={`${styles.dashboard}`}>
        <img src={logo} alt="Logo RuangTumbuh" />
      </div>
    </div>
  );
}
