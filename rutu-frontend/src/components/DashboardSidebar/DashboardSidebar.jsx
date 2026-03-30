import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import logo from "../../assets/logo.svg";

// 1. IMPORT REACT ICONS (Feather Icons)
import {
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiUsers,
  FiLifeBuoy,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

const mainMenu = [
  { id: 1, label: "Beranda", link: "/dashboard", icon: FiHome },
  {
    id: 2,
    label: "Kursus Saya",
    link: "/booking",
    icon: FiBookOpen,
  },
  {
    id: 3,
    label: "Materi & Kursus",
    link: "/search",
    icon: FiCalendar,
  },
  {
    id: 4,
    label: "Jadwal",
    link: "/schedule",
    icon: FiCalendar,
  },
  { id: 5, label: "Komunitas", link: "/messages", icon: FiUsers },
];

export default function DashboardSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    toggleSidebar();
    navigate("/logout");
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={toggleSidebar}
      ></div>

      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        {/* --- HEADER LOGO BRUTAL --- */}
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="Logo RuangTumbuh" className={styles.logo} />
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoRuang}>RUANG</span>
              <span className={styles.logoTumbuh}>TUMBUH</span>
            </div>
          </Link>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            ✕
          </button>
        </div>

        {/* --- MENU NAVIGASI --- */}
        <nav className={styles.nav}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>MENU UTAMA</h4>
            {mainMenu.map((item) => {
              const isActive = location.pathname === item.link;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`${styles.linkItem} ${isActive ? styles.linkActive : ""}`}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <div className={styles.linkContent}>
                    <Icon className={styles.linkIcon} />
                    <span className={styles.linkLabel}>{item.label}</span>
                  </div>
                  <FiChevronRight className={styles.linkArrow} />
                </Link>
              );
            })}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>SETTING</h4>
            <Link to="/support" className={styles.linkItem}>
              <div className={styles.linkContent}>
                <FiLifeBuoy className={styles.linkIcon} />
                <span className={styles.linkLabel}>Pusat Bantuan</span>
              </div>
              <FiChevronRight className={styles.linkArrow} />
            </Link>
            <button
              className={`${styles.linkItem} ${styles.logoutBtn}`}
              onClick={handleLogout}
            >
              <div className={styles.linkContent}>
                <FiLogOut className={styles.linkIcon} />
                <span className={styles.linkLabel}>Log out</span>
              </div>
              <FiChevronRight className={styles.linkArrow} />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
