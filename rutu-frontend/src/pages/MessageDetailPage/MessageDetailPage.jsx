import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./MessageDetailPage.module.css";
import { FiSend, FiArrowLeft, FiMoreVertical, FiPaperclip, FiSmile } from "react-icons/fi";

export default function MessageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef(null);

  // Dummy data based on MessagesPage
  const contacts = {
    1: { name: "Grace Ashcroft", color: "#38BDF8", status: "Online" },
    2: { name: "Carloz", color: "#FB923C", status: "Last seen 2h ago" },
    3: { name: "Ashly", color: "#F472B6", status: "Online" },
    4: { name: "Donatur", color: "#FACC15", status: "Offline" },
    5: { name: "Leonor", color: "#38BDF8", status: "Online" },
    6: { name: "Chris Redfield", color: "#FB923C", status: "Online" },
    7: { name: "Leon Scott", color: "#F472B6", status: "Last seen 5m ago" },
  };

  const contact = contacts[id] || { name: "Unknown", color: "#E5E7EB", status: "Offline" };

  const [messages, setMessages] = useState([
    { id: 1, text: "Halo!", sender: "other", time: "12:00" },
    { id: 2, text: "Apa kabar?", sender: "other", time: "12:01" },
    { id: 3, text: "Baik, kamu?", sender: "me", time: "12:05" },
    { id: 4, text: contact.text || "Ayo masuk ke zoom meetingnya", sender: "other", time: "12:30" },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <DashboardLayout title="Message Detail">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate("/messages")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowLeft size={24} />
          </button>
          
          <div className={styles.userInfo}>
            <div 
              className={styles.avatar} 
              style={{ backgroundColor: contact.color }}
            ></div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{contact.name}</h2>
              <span className={styles.status}>{contact.status}</span>
            </div>
          </div>

          <button className={styles.menuButton}>
            <FiMoreVertical size={24} />
          </button>
        </header>

        {/* Messages Area */}
        <div className={styles.chatArea} ref={scrollRef}>
          <div className={styles.dateSeparator}>
            <span>Today</span>
          </div>
          
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`${styles.messageWrapper} ${msg.sender === "me" ? styles.me : styles.other}`}
              >
                <div 
                  className={styles.messageBubble}
                  style={msg.sender === "other" ? { backgroundColor: contact.color } : {}}
                >
                  <p>{msg.text}</p>
                  <span className={styles.time}>{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <form className={styles.inputArea} onSubmit={handleSendMessage}>
          <button type="button" className={styles.iconButton}>
            <FiPaperclip size={20} />
          </button>
          
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.input}
            />
            <button type="button" className={styles.iconButton}>
              <FiSmile size={20} />
            </button>
          </div>

          <motion.button
            type="submit"
            className={styles.sendButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputText.trim()}
          >
            <FiSend size={20} />
          </motion.button>
        </form>
      </div>
    </DashboardLayout>
  );
}
