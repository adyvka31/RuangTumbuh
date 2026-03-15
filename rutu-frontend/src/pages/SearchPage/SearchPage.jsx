import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { motion } from "framer-motion";

export default function SearchPage() {
  return (
    <DashboardLayout title="Search">
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
          <h2>Search Something...</h2>
          <p>This is a dummy Search page to test the layout.</p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
