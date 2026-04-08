import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MessageDetailPage.module.css";
import {
  FiSend,
  FiArrowLeft,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiPhone,
  FiVideo,
} from "react-icons/fi";

export default function MessageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef(null);

  // Data Mockup
  const contacts = {
    1: { name: "Grace Ashcroft", color: "#38BDF8", status: "Online" },
    2: { name: "Carloz", color: "#FB923C", status: "Last seen 2h ago" },
    3: { name: "Ashly", color: "#F472B6", status: "Online" },
    4: { name: "Donatur", color: "#FACC15", status: "Offline" },
    5: { name: "Leonor", color: "#38BDF8", status: "Online" },
    6: { name: "Chris Redfield", color: "#FB923C", status: "Online" },
    7: { name: "Leon Scott", color: "#F472B6", status: "Last seen 5m ago" },
  };

  const contact = contacts[id] || {
    name: "Unknown",
    color: "#E5E7EB",
    status: "Offline",
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "Halo Kak! 👋", sender: "other", time: "12:00" },
    {
      id: 2,
      text: "Saya ingin bertanya terkait materi di kelas UI/UX.",
      sender: "other",
      time: "12:01",
    },
    {
      id: 3,
      text: "Tentu, silakan tanyakan saja. Bagian mana yang membingungkan?",
      sender: "me",
      time: "12:05",
    },
    {
      id: 4,
      text: contact.text || "Apakah kita bisa bahas via Zoom sebentar?",
      sender: "other",
      time: "12:30",
    },
  ]);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <DashboardLayout title="Detail Pesan">
      <div className={styles.container}>
        {/* --- HEADER --- */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.button
              className={styles.backButton}
              onClick={() => navigate("/messages")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft size={22} />
            </motion.button>

            <div className={styles.userInfo}>
              <div className={styles.avatarWrap}>
                <div
                  className={styles.avatar}
                  style={{ backgroundColor: contact.color }}
                >
                  {contact.name.charAt(0)}
                </div>
                {contact.status === "Online" && (
                  <div className={styles.onlineDot}></div>
                )}
              </div>
              <div className={styles.userDetails}>
                <h2 className={styles.userName}>{contact.name}</h2>
                <span className={styles.status}>{contact.status}</span>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.actionBtn}>
              <FiPhone size={20} />
            </button>
            <button className={styles.actionBtn}>
              <FiVideo size={20} />
            </button>
            <div className={styles.divider}></div>
            <button className={styles.actionBtn}>
              <FiMoreVertical size={22} />
            </button>
          </div>
        </header>

        {/* --- CHAT AREA --- */}
        <div className={styles.chatArea} ref={scrollRef}>
          <div className={styles.dateSeparator}>
            <span>Hari ini</span>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isMe = msg.sender === "me";
              const showAvatar =
                !isMe && (index === 0 || messages[index - 1].sender === "me");

              return (
                <motion.div
                  key={msg.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`${styles.messageWrapper} ${isMe ? styles.me : styles.other}`}
                >
                  {/* Avatar untuk pesan lawan bicara */}
                  {!isMe && (
                    <div className={styles.chatAvatarBox}>
                      {showAvatar ? (
                        <div
                          className={styles.chatAvatar}
                          style={{ backgroundColor: contact.color }}
                        >
                          {contact.name.charAt(0)}
                        </div>
                      ) : (
                        <div className={styles.chatAvatarPlaceholder} />
                      )}
                    </div>
                  )}

                  <div className={styles.messageBubble}>
                    <p className={styles.messageText}>{msg.text}</p>
                    <span className={styles.time}>{msg.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* --- INPUT AREA --- */}
        <div className={styles.inputContainer}>
          <form className={styles.inputForm} onSubmit={handleSendMessage}>
            <button type="button" className={styles.attachBtn}>
              <FiPaperclip size={22} />
            </button>

            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={styles.input}
              />
              <button type="button" className={styles.emojiBtn}>
                <FiSmile size={22} />
              </button>
            </div>

            <motion.button
              type="submit"
              className={styles.sendButton}
              style={{
                backgroundColor: inputText.trim()
                  ? "var(--primary-green, #4ade80)"
                  : "#e5e7eb",
              }}
              whileHover={inputText.trim() ? { scale: 1.05, rotate: -10 } : {}}
              whileTap={inputText.trim() ? { scale: 0.95 } : {}}
              disabled={!inputText.trim()}
            >
              <FiSend size={20} color={inputText.trim() ? "#000" : "#9ca3af"} />
            </motion.button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
