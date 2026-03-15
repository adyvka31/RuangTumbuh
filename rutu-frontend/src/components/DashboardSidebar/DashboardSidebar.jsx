import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import logo from "@/assets/logo.svg";

const navItems = [
  { id: "dashboard", icon: "⊞", path: "/dashboard" },
  { id: "search", icon: "🔍", path: "/search" },
  { id: "bookmarks", icon: "🔖", path: "/bookmarks" },
  { id: "messages", icon: "💬", path: "/messages" },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.logoWrapper}>
        <img src={logo} alt="Logo" className={styles.sidebarLogo} onClick={() => navigate("/")} />
      </div>
      <nav className={styles.navItems}>
        {navItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.navItemActive : ""}`}
            onClick={() => {
              navigate(item.path);
              if (onClose) onClose();
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
