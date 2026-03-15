import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { motion } from "framer-motion";

export default function BookmarksPage() {
  return (
    <DashboardLayout title="Bookmarks">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ 
          padding: '40px', 
          border: '4px solid black', 
          borderRadius: '20px', 
          backgroundColor: '#fff',
          boxShadow: '8px 8px 0px black'
        }}>
          <h2>My Bookmarks</h2>
          <p>This is a dummy Bookmarks page to test the layout.</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
