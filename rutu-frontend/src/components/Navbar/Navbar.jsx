import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@assets/logo.svg";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. STATE BARU: Untuk melacak apakah halaman baru saja dimuat
  const [isStartup, setIsStartup] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // 2. EFEK STARTUP: Matikan status 'menyatu' setelah 800ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStartup(false);
    }, 600); // 800ms adalah waktu tunggu sebelum navbar membelah (bisa Anda sesuaikan)

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3. KONDISI GABUNGAN: Navbar akan menyatu jika sedang Startup ATAU sedang di-scroll
  const isMerged = isStartup || isScrolled;

  return (
    <motion.div
      // Masukkan kondisi isMerged ke dalam class
      className={`${styles.headerContainer} ${isMerged ? styles.scrolled : ""}`}
      // Animasi turun dari atap tetap dipertahankan
      initial={{ y: -100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
    >
      {/* Kita kembalikan ke tag <nav> biasa karena animasi belahnya sudah diurus oleh CSS murni Anda! */}
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

      {/* Sama seperti nav, ini dikembalikan ke div biasa */}
      <div
        className={`${styles.dashboard}`}
        onClick={(e) => handleScrollTo(e, "beranda")}
      >
        <img src={logo} alt="Logo RuangTumbuh" />
      </div>
    </motion.div>
  );
}
