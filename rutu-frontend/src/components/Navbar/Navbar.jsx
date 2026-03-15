import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // <-- IMPORT ROUTER HOOKS
import logo from "@assets/logo.svg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook dari React Router untuk navigasi dan mengecek halaman saat ini
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      // Jika sudah di Home, langsung meluncur!
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`${styles.headerContainer} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.navbar}>
        {/* Hamburger Button */}
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

        {/* --- DESKTOP MENU --- */}
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
          {/* Tombol Sign In & Get Started menggunakan navigasi halaman */}
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

        {/* --- MOBILE MENU --- */}
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

      {/* Logo klik untuk kembali ke atas */}
      <div
        className={`${styles.dashboard}`}
        onClick={(e) => handleScrollTo(e, "beranda")}
      >
        <img src={logo} alt="Logo RuangTumbuh" />
      </div>
    </div>
  );
}
