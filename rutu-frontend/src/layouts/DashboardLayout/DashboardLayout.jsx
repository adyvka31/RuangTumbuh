import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardSidebar from "@/components/DashboardSidebar/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar/DashboardTopbar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className={styles.overlay}
          />
        )}
      </AnimatePresence>

      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={styles.mainWrapper}>
        <DashboardTopbar title={title} onMenuClick={toggleSidebar} />
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
