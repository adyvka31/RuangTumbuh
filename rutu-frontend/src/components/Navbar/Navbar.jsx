import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.svg"; // Sesuaikan path jika berbeda

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <div
      className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.navbar}>
        {/* Hamburger Button (mobile only) */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}></span>
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}></span>
        </button>

        <div className={styles.left}>
          <a href="#home" onClick={handleLinkClick}>HOME</a>
          <a href="#find_tutor" onClick={handleLinkClick}>LEARN & TEACH</a>
          <a href="#calendar" onClick={handleLinkClick}>CALENDAR</a>
          <a href="#session" onClick={handleLinkClick}>SESSION</a>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.right}>
          <a href="#signin">SIGN IN</a>
          <button className={styles.button}>GET STARTED</button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
          <a href="#home" onClick={handleLinkClick}>HOME</a>
          <a href="#find_tutor" onClick={handleLinkClick}>LEARN & TEACH</a>
          <a href="#calendar" onClick={handleLinkClick}>CALENDAR</a>
          <a href="#session" onClick={handleLinkClick}>SESSION</a>
          <div className={styles.mobileMenuDivider}></div>
          <a href="#signin" onClick={handleLinkClick}>SIGN IN</a>
          <button className={styles.button} onClick={handleLinkClick}>GET STARTED</button>
        </div>
      </nav>

      <div className={`${styles.dashboard}`}>
        <img src={logo} alt="Logo RuangTumbuh" />
      </div>
    </div>
  );
}

