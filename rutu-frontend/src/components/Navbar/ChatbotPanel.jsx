import React, { useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatbotPanel.module.css";
import { useChatbot } from "@/hooks/useChatbot";

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
  const { messages, input, setInput, isTyping, chatBodyRef, handleSend } =
    useChatbot();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.layerOne}
            initial="closed"
            animate="open"
            exit="closed"
            custom={{ openDelay: 0, closeDelay: 0.2 }}
            variants={layerVariants}
          />
          <motion.div
            className={styles.layerTwo}
            initial="closed"
            animate="open"
            exit="closed"
            custom={{ openDelay: 0.1, closeDelay: 0.1 }}
            variants={layerVariants}
          />
          <motion.div
            className={styles.chatbotContainer}
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
          >
            <ChatHeader onClose={onClose} />
            <ChatBody
              messages={messages}
              isTyping={isTyping}
              chatBodyRef={chatBodyRef}
            />
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatHeader({ onClose }) {
  return (
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
  );
}

function ChatBody({ messages, isTyping, chatBodyRef }) {
  useEffect(() => {
    const container = chatBodyRef.current;
    if (container) {
      const threshold = 100;
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, isTyping]);

  return (
    <div className={styles.chatBody} ref={chatBodyRef}>
      {messages.map((msg) => (
        <ChatBubble key={msg.id} msg={msg} />
      ))}
      <AnimatePresence>
        {isTyping && <TypingIndicator key="typing" />}
      </AnimatePresence>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x: isUser ? 40 : -40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}
    >
      <span className={styles.sender}>
        {isUser ? "Kamu" : "RuangTumbuh Bot"}
      </span>
      <p>{msg.text}</p>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
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
  );
}

function ChatInput({ input, setInput, handleSend }) {
  return (
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
  );
}