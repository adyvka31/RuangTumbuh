import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatbotPanel.module.css";

// Animasi Lapisan Warna (Layer)
const layerVariants = {
  open: (custom) => ({
    x: "0%",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.6,
      delay: custom.openDelay,
    },
  }),
  closed: (custom) => ({
    x: "100%",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
      delay: custom.closeDelay,
    },
  }),
};

// Animasi Panel Utama
const panelVariants = {
  open: {
    x: "0%",
    transition: { type: "spring", bounce: 0, duration: 0.6, delay: 0.2 },
  },
  closed: {
    x: "100%",
    transition: { type: "spring", bounce: 0, duration: 0.4, delay: 0 },
  },
};

export default function ChatbotPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Ada yang bisa RuangTumbuh bantu? Tanya apa saja seputar kelas, komunitas, atau fitur kami!",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  // STATE UNTUK TYPING INDICATOR
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Otomatis scroll ke bawah setiap ada pesan baru atau saat indikator typing muncul
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Tampilkan pesan User seketika
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: "user" },
    ]);
    setInput("");

    // 2. Jeda waktu tunggu (1.2 detik) agar tidak terkesan bot langsung membalas
    setTimeout(() => {
      setIsTyping(true); // Munculkan indikator "Bot is typing..."

      // 3. Bot "berpura-pura mengetik" selama 2 detik
      setTimeout(() => {
        setIsTyping(false); // Hilangkan indikator typing
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Pertanyaan yang menarik! Saat ini otak AI RuangTumbuh masih dalam tahap pembelajaran. Nantikan update fitur kecerdasan kami segera! 🚀",
            sender: "bot",
          },
        ]);
      }, 1500);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* LAPISAN BIRU */}
          <motion.div
            className={styles.layerOne}
            initial="closed"
            animate="open"
            exit="closed"
            custom={{ openDelay: 0, closeDelay: 0.2 }}
            variants={layerVariants}
          />

          {/* LAPISAN MERAH muda */}
          <motion.div
            className={styles.layerTwo}
            initial="closed"
            animate="open"
            exit="closed"
            custom={{ openDelay: 0.1, closeDelay: 0.1 }}
            variants={layerVariants}
          />

          {/* PANEL CHATBOT UTAMA */}
          <motion.div
            className={styles.chatbotContainer}
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
          >
            {/* HEADER */}
            <div className={styles.chatHeader}>
              <div className={styles.groupInfo}>
                <div className={styles.groupAvatar}>🤖</div>
                <div>
                  <h3 className={styles.groupName}>RuangTumbuh Bot</h3>
                  <p className={styles.onlineStatus}>
                    <span className={styles.onlineDot}></span> Online
                  </p>
                </div>
              </div>
              <button onClick={onClose} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            {/* BODY CHAT (Tempat Gelembung Pesan) */}
            <div className={styles.chatBody} ref={chatBodyRef}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  // ANIMASI MUNCUL SERONG (DIAGONAL)
                  initial={{
                    opacity: 0,
                    y: 40,
                    x: msg.sender === "user" ? 40 : -40,
                    scale: 0.8,
                  }}
                  animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  // EFEK HOVER FRAMER MOTION (Memantul saat kursor di atas bubble)
                  whileHover={{
                    y: -2,
                    scale: 1.02,
                    boxShadow: "4px 4px 0px #000",
                  }}
                  className={`${styles.bubble} ${msg.sender === "user" ? styles.userBubble : styles.botBubble}`}
                >
                  <span className={styles.sender}>
                    {msg.sender === "user" ? "Kamu" : "RuangTumbuh Bot"}
                  </span>
                  <p>{msg.text}</p>
                </motion.div>
              ))}

              {/* INDIKATOR TYPING DENGAN ANIMASI KELUAR-MASUK */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    // Muncul serong dari kiri bawah
                    initial={{ opacity: 0, y: 40, x: -40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: 20,
                      x: -20,
                      scale: 0.8,
                      transition: { duration: 0.2 },
                    }}
                    className={styles.typingIndicator}
                  >
                    <span>Bot is typing</span>
                    <div className={styles.dots}>
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                      <div className={styles.dot} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* INPUT CHAT */}
            <form onSubmit={handleSend} className={styles.chatInput}>
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.inputBox}
              />
              <button type="submit" className={styles.sendBtn}>
                ➔
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
