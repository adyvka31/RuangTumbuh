import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import logo from "../../assets/logo.svg";
import { Popup } from "../Popup/Popup";
import { FiAlertCircle } from "react-icons/fi";

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
    link: "/mycourses",
    icon: FiBookOpen,
  },
  {
    id: 3,
    label: "Sesi & Kursus",
    link: "/search",
    icon: FiCalendar,
  },
  {
    id: 4,
    label: "Jadwal Belajar",
    link: "/schedule",
    icon: FiCalendar,
  },
  { id: 5, label: "Komunitas", link: "/messages", icon: FiUsers },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    logout();
    window.location.replace("/");
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
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
          <button className={styles.closeBtn} onClick={onClose}>
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
                  onClick={() => window.innerWidth < 1024 && onClose()}
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
            <Link to="/help" className={styles.linkItem}>
              <div className={styles.linkContent}>
                <FiLifeBuoy className={styles.linkIcon} />
                <span className={styles.linkLabel}>Pusat Bantuan</span>
              </div>
              <FiChevronRight className={styles.linkArrow} />
            </Link>
            <button
              className={`${styles.linkItem} ${styles.logoutBtn}`}
              onClick={handleLogoutClick}
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

      {showLogoutPopup && (
        <Popup
          isOpen={true}
          type="danger"
          icon={<FiAlertCircle />}
          title="Keluar dari Akun?"
          description="Apakah kamu yakin ingin keluar dari RuangTumbuh?"
          buttonText="Lanjutkan"
          onAction={confirmLogout}
          secondaryButtonText="Batal"
          onSecondaryAction={() => setShowLogoutPopup(false)}
        />
      )}
    </>
  );
}
