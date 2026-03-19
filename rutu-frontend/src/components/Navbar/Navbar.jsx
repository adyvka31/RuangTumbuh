import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css";
import logo from "@assets/logo.svg";
import ChatbotPanel from "./ChatbotPanel";
import { useNavbar } from "@/hooks/useNavbar"; // Import Hook Anda!

export default function Navbar() {
  const {
    isMenuOpen,
    isChatOpen,
    setIsChatOpen,
    isMerged,
    toggleMenu,
    closeMenu,
    handleScrollTo,
    navigate,
  } = useNavbar();

  return (
    <>
      <motion.div
        className={`${styles.headerContainer} ${isMerged ? styles.scrolled : ""}`}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        <nav className={styles.navbar}>
          <HamburgerButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <DesktopMenu handleScrollTo={handleScrollTo} navigate={navigate} />
          <MobileMenu
            isMenuOpen={isMenuOpen}
            handleScrollTo={handleScrollTo}
            closeMenu={closeMenu}
            navigate={navigate}
          />
        </nav>

        <BrandLogo isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      </motion.div>

      <ChatbotPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

// === SUB-KOMPONEN UI ===

function HamburgerButton({ isMenuOpen, toggleMenu }) {
  return (
    <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menu">
      <span
        className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
      />
      <span
        className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
      />
      <span
        className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
      />
    </button>
  );
}

function DesktopMenu({ handleScrollTo, navigate }) {
  return (
    <>
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
        <button className={styles.button} onClick={() => navigate("/register")}>
          GET STARTED
        </button>
      </div>
    </>
  );
}

function MobileMenu({ isMenuOpen, handleScrollTo, closeMenu, navigate }) {
  return (
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
  );
}

function BrandLogo({ isChatOpen, setIsChatOpen }) {
  return (
    <div
      className={styles.dashboard}
      onClick={() => setIsChatOpen(!isChatOpen)}
    >
      <img src={logo} alt="Logo RuangTumbuh" />
    </div>
  );
}
