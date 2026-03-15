import styles from "./Navbar.module.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@assets/logo.svg";
import { useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook dari React Router untuk navigasi dan mengecek halaman saat ini
  const location = useLocation();
  const navigate = useNavigate();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Akan mengecek tanpa membebani thread utama
    setIsScrolled(latest > 50);
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fungsi pintar untuk Scroll ke ID Section tertentu
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname !== "/") {
      // Jika user sedang di halaman Login/Register, lempar ke Home dulu
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300); // Beri jeda sedikit agar Home selesai di-render
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.navbar}>
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
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

        <div className={styles.left}>
          <a href="#beranda" onClick={(e) => handleScrollTo(e, "beranda")}>
            HOME
          </a>
          <a href="#kalender" onClick={(e) => handleScrollTo(e, "kalender")}>
            CALENDAR
          </a>
          <a href="#alur" onClick={(e) => handleScrollTo(e, "alur")}>
            SESSION
          </a>
          <a href="#komunitas" onClick={(e) => handleScrollTo(e, "komunitas")}>
            COMMUNITY
          </a>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.right}>
          <Link to="/login" className={styles.navLink}>
            SIGN IN
          </Link>
          <button
            className={styles.button}
            onClick={() => navigate("/register")}
          >
            GET STARTED
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}
        >
          <a href="#beranda" onClick={(e) => handleScrollTo(e, "beranda")}>
            BERANDA
          </a>
          <a href="#kalender" onClick={(e) => handleScrollTo(e, "kalender")}>
            KALENDER
          </a>
          <a href="#alur" onClick={(e) => handleScrollTo(e, "alur")}>
            ALUR
          </a>
          <a href="#komunitas" onClick={(e) => handleScrollTo(e, "komunitas")}>
            KOMUNITAS
          </a>

          <div className={styles.mobileMenuDivider}></div>

          <Link to="/login" onClick={closeMenu} className={styles.navLink}>
            SIGN IN
          </Link>
          <button
            className={styles.button}
            onClick={() => {
              closeMenu();
              navigate("/register");
            }}
          >
            GET STARTED
          </button>
        </div>
      </nav>

      <div
        className={`${styles.dashboard}`}
        onClick={(e) => handleScrollTo(e, "beranda")}
      >
        <img src={logo} alt="Logo RuangTumbuh" />
      </div>
    </div>
  );
}
