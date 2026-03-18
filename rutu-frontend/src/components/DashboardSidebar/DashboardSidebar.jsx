import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import logo from "@/assets/logo.svg";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard", path: "/dashboard" },
  { id: "booking", icon: "📦", label: "My Courses", path: "/booking" },
  { id: "learn", icon: "💡", label: "Learn", path: "/search" },
  { id: "messages", icon: "💬", label: "Messages", path: "/messages" },
  { id: "schedule", icon: "🗓️", label: "Schedule", path: "/schedule" },
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
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>

          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
