import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MessageDetailPage.module.css";
import { io } from "socket.io-client";
import {
  FiSend,
  FiArrowLeft,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiPhone,
  FiVideo,
} from "react-icons/fi";

// URL Backend
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";

export default function MessageDetailPage() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState({ name: "Memuat..." });
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const [chatPartner, setChatPartner] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // --- KONEKSI SOCKET.IO ---
  useEffect(() => {
    if (!token) return;

    const newSocket = io(BASE_URL, {
      auth: { token },
    });

    socketRef.current = newSocket;

    newSocket.emit("join_room", roomId);

    newSocket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, token]);

  // --- AMBIL RIWAYAT CHAT LAMA (REST API) ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/chats/${roomId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const result = await response.json(); 

        // Cek sukses di tempat yang benar
        if (result.success) {
          setRoomInfo(result.data.room);
          setMessages(result.data.messages);
          setChatPartner(result.data.chatPartner); // Simpan data lawan bicara
        }
      } catch (error) {
        console.error("Gagal mengambil riwayat pesan:", error);
      }
    };

    if (token && roomId) {
      fetchHistory();
    }
  }, [roomId, token]);

  // --- 3. AUTO SCROLL KE BAWAH ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // --- 4. KIRIM PESAN BARU ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socketRef.current) return;

    // Pancarkan ke backend menggunakan socketRef.current
    socketRef.current.emit("send_message", {
      roomId: roomId,
      text: inputText,
    });

    setInputText(""); // Kosongkan input
  };

  // Helper untuk format jam (contoh: 14:30)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
                  style={{
                    backgroundColor: roomInfo.isGroup ? "#38BDF8" : "#FB923C",
                  }}
                >
                  {roomInfo.isGroup
                    ? roomInfo.name
                      ? roomInfo.name.charAt(0)
                      : "G"
                    : chatPartner
                      ? chatPartner.name.charAt(0).toUpperCase()
                      : "?"}
                </div>
                <div className={styles.onlineDot}></div>
              </div>
              <div className={styles.userDetails}>
                <h2 className={styles.userName}>
                  {roomInfo.isGroup
                    ? roomInfo.name
                    : chatPartner
                      ? chatPartner.name
                      : "Memuat..."}
                </h2>
                <span className={styles.status}>
                  {roomInfo.isGroup
                    ? "Komunitas"
                    : chatPartner
                      ? chatPartner.description || "Siswa"
                      : "Online"}
                </span>
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
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              // Cek apakah pesan ini milik kita atau orang lain
              const isMe = msg.senderId === currentUser.id;

              // Tentukan apakah perlu menampilkan avatar (hanya untuk orang lain)
              const showAvatar =
                !isMe &&
                (index === 0 || messages[index - 1].senderId !== msg.senderId);

              return (
                <motion.div
                  key={msg.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`${styles.messageWrapper} ${isMe ? styles.me : styles.other}`}
                >
                  {/* Tampilkan Avatar Pengirim (Jika bukan pesan kita) */}
                  {!isMe && (
                    <div className={styles.chatAvatarBox}>
                      {showAvatar ? (
                        <div
                          className={styles.chatAvatar}
                          style={{ backgroundColor: "#FACC15" }}
                        >
                          {msg.sender?.name
                            ? msg.sender.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      ) : (
                        <div className={styles.chatAvatarPlaceholder} />
                      )}
                    </div>
                  )}

                  <div className={styles.messageBubble}>
                    {!isMe && showAvatar && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "800",
                          opacity: 0.7,
                          marginBottom: "4px",
                        }}
                      >
                        {msg.sender?.name}
                      </span>
                    )}
                    <p className={styles.messageText}>{msg.text}</p>
                    <span className={styles.time}>
                      {formatTime(msg.createdAt)}
                    </span>
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
                placeholder="Ketik pesan komunitas..."
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
