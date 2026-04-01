import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MessagesPage.module.css";
import { FiSearch, FiUsers, FiUser, FiSliders } from "react-icons/fi";
import { BsCheckAll } from "react-icons/bs";

// --- DUMMY DATA ---
const allMessages = [
  {
    id: 1,
    type: "group",
    name: "Frontend Masterclass 🚀",
    text: "Grace: Ayo masuk ke zoom meetingnya sekarang!",
    time: "12:30",
    color: "#38BDF8",
    emoji: "👨‍💻",
    unread: 3,
  },
  {
    id: 2,
    type: "personal",
    name: "Carloz",
    text: "Pe, info mabar ntar malem",
    time: "11:30",
    color: "#FB923C",
    emoji: "👦",
    unread: 1,
  },
  {
    id: 3,
    type: "personal",
    name: "Ashly",
    text: "p, udanh ngerjain tugasnya belum?",
    time: "10:30",
    color: "#F472B6",
    emoji: "👩",
    unread: 0,
  },
  {
    id: 4,
    type: "group",
    name: "UI/UX Enthusiast 🎨",
    text: "Donatur: Ada yang mau review design figma saya?",
    time: "08:30",
    color: "#FACC15",
    emoji: "✨",
    unread: 5,
  },
  {
    id: 5,
    type: "personal",
    name: "Leonor",
    text: "Ikut kelasnya ga hari ini???",
    time: "Kemarin",
    color: "#A78BFA",
    emoji: "👱‍♀️",
    unread: 0,
  },
  {
    id: 6,
    type: "personal",
    name: "Chris Redfield",
    text: "Boleh minta catatannya dong bro",
    time: "Kemarin",
    color: "#10B981",
    emoji: "🧔",
    unread: 0,
  },
  {
    id: 7,
    type: "group",
    name: "Komunitas React Indo",
    text: "Leon Scott: Ada yang pernah error hooks ini?",
    time: "Senin",
    color: "#F472B6",
    emoji: "⚛️",
    unread: 12,
  },
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Membagi pesan ke dalam dua kategori dengan filter pencarian aktif
  const personalMessages = allMessages.filter(
    (msg) =>
      msg.type === "personal" &&
      (msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const groupMessages = allMessages.filter(
    (msg) =>
      msg.type === "group" &&
      (msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Animasi untuk setiap kartu pesan
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
  };

  // Komponen reusable untuk Kartu Pesan
  const MessageCard = ({ msg }) => (
    <motion.div
      // layout <-- HAPUS PROP INI. Prop 'layout' seringkali mengunci transform CSS biasa.
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className={`${styles.messageItem} ${msg.unread > 0 ? styles.unreadItem : ""}`}
      onClick={() => navigate(`/message/${msg.id}`)}
    >
      <div className={styles.avatar} style={{ backgroundColor: msg.color }}>
        {msg.emoji}
        {msg.type === "personal" && <span className={styles.onlineDot}></span>}
      </div>

      <div className={styles.textGroup}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{msg.name}</span>
        </div>
        <p
          className={`${styles.text} ${msg.unread > 0 ? styles.textBold : ""}`}
        >
          {msg.text}
        </p>
      </div>

      <div className={styles.metaGroup}>
        <span
          className={`${styles.time} ${msg.unread > 0 ? styles.timeUnread : ""}`}
        >
          {msg.time}
        </span>
        {msg.unread > 0 ? (
          <div className={styles.unreadBadge}>{msg.unread}</div>
        ) : (
          <BsCheckAll className={styles.readIcon} />
        )}
      </div>
    </motion.div>
  );

  return (
    <DashboardLayout title="Pesan & Komunitas">
      <div className={styles.container}>
        {/* --- HERO BANNER --- */}
        <motion.div
          className={styles.searchBanner}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className={styles.bannerContent}>
            <h2>Buat Relasi Menjadi Aksi 🤝</h2>
            <p>
              Temukan teman belajar, mentor, dan komunitas yang akan mendukung
              perjalanan belajarmu. Ayo mulai ngobrol dan berkembang bersama!
            </p>
          </div>
          <div className={styles.mascotBox}>
            <div className={styles.floatingShape}>✦</div>
            <div className={styles.floatingShape2}>●</div>
          </div>
        </motion.div>
        {/* --- SEARCH BAR --- */}
        <div className={styles.searchBarRow}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Cari room chat atau group chat Anda..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn}>
            <FiSliders size={24} />
          </button>
        </div>

        {/* --- 50:50 SPLIT LAYOUT --- */}
        <div className={styles.splitLayout}>
          {/* KOLOM KIRI: Chat Personal */}
          <div className={styles.columnBox}>
            <div className={styles.columnHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#FACC15" }}
              >
                <FiUser />
              </div>
              <h3>Chat Personal</h3>
              <span className={styles.countBadge}>
                {personalMessages.length}
              </span>
            </div>

            <div className={styles.messageList}>
              <AnimatePresence>
                {personalMessages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Tidak ada pesan personal ditemukan.</p>
                  </div>
                ) : (
                  personalMessages.map((msg) => (
                    <MessageCard key={msg.id} msg={msg} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* KOLOM KANAN: Grup Komunitas */}
          <div className={styles.columnBox}>
            <div className={styles.columnHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#38BDF8" }}
              >
                <FiUsers />
              </div>
              <h3>Grup Komunitas</h3>
              <span className={styles.countBadge}>{groupMessages.length}</span>
            </div>

            <div className={styles.messageList}>
              <AnimatePresence>
                {groupMessages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Tidak ada grup komunitas ditemukan.</p>
                  </div>
                ) : (
                  groupMessages.map((msg) => (
                    <MessageCard key={msg.id} msg={msg} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
