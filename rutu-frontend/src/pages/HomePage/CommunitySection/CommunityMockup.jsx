import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./CommunityMockup.module.css";

// 1. Import semua shape yang dibutuhkan
import shape4 from "@assets/shape4.svg";
import shape9 from "@assets/shape9.svg";
import shape12 from "@assets/shape12.svg";
import shape1 from "@assets/shape1.svg";

export default function CommunityMockup() {
  const [activeCard, setActiveCard] = useState(1);
  const isSwapping = useRef(false);

  const handleDrag = (event, info) => {
    if (isSwapping.current) return;

    if (Math.abs(info.offset.x) > 40 || Math.abs(info.offset.y) > 40) {
      isSwapping.current = true;
      setActiveCard((prev) => (prev === 0 ? 1 : 0));

      setTimeout(() => {
        isSwapping.current = false;
      }, 400);
    }
  };

  return (
    <div className={styles.stackWrapper}>
      {/* ==========================================
          KARTU 1: COMMUNITY ROOM (LIST)
          ========================================== */}
      <div className={styles.scrollWrapper}>
        <motion.div
          className={`${styles.mockupCard} ${styles.mockupList}`}
          onClick={() => setActiveCard(0)}
          drag={activeCard === 0}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.15}
          onDrag={handleDrag}
          animate={{
            x: activeCard === 0 ? 0 : 40,
            y: activeCard === 0 ? 0 : -40,
            scale: activeCard === 0 ? 1 : 0.95,
            zIndex: activeCard === 0 ? 10 : 5,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* MENGGUNAKAN ANIMASI floatDecorCSS SEPERTI DI STACK LAYOUT */}
          <img
            src={shape12}
            alt=""
            aria-hidden="true"
            className={`${styles.decorShape} ${styles.shapeListTR}`}
            style={{
              animation: "floatDecorCSS 5s ease-in-out infinite",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />
          <img
            src={shape4}
            alt=""
            aria-hidden="true"
            className={`${styles.decorShape} ${styles.shapeListBL}`}
            style={{
              animation: "floatDecorCSS 4.5s ease-in-out infinite",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* PEMBUNGKUS KONTEN DALAM */}
          <div className={styles.cardInner}>
            <div className={styles.listHeader}>
              <h3 className={styles.listTitle}>Community Room</h3>
              <div className={styles.searchBar}>🔍 Cari obrolan...</div>
            </div>
            <div className={styles.listBody}>
              <div className={styles.listItem}>
                <div
                  className={styles.avatar}
                  style={{ background: "var(--primary-green)" }}
                >
                  UI
                </div>
                <div className={styles.listInfo}>
                  <h4>UI/UX Design Masterclass</h4>
                  <p>Mentor: Jangan lupa tugas besok ya!</p>
                </div>
                <div className={styles.unreadBadge}>2</div>
              </div>
              <div className={styles.listItem}>
                <div
                  className={styles.avatar}
                  style={{ background: "var(--primary-yellow)" }}
                >
                  💻
                </div>
                <div className={styles.listInfo}>
                  <h4>Ruang Frontend Dev</h4>
                  <p>Siswa A: Wah, makasih infonya kak...</p>
                </div>
              </div>
              <div className={styles.listItem}>
                <div
                  className={styles.avatar}
                  style={{ background: "var(--primary-blue)" }}
                >
                  🚀
                </div>
                <div className={styles.listInfo}>
                  <h4>Career Prep 2026</h4>
                  <p>Budi: Ada info loker terbaru nih guys.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==========================================
          KARTU 2: CHAT ROOM SQUAD
          ========================================== */}
      <div className={styles.scrollWrapper}>
        <motion.div
          className={`${styles.mockupCard} ${styles.mockupChat}`}
          onClick={() => setActiveCard(1)}
          drag={activeCard === 1}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={0.15}
          onDrag={handleDrag}
          animate={{
            x: activeCard === 1 ? 0 : 40,
            y: activeCard === 1 ? 0 : -40,
            scale: activeCard === 1 ? 1 : 0.95,
            zIndex: activeCard === 1 ? 10 : 5,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <img
            src={shape9}
            alt=""
            aria-hidden="true"
            className={`${styles.decorShape} ${styles.shapeChatTL}`}
            style={{
              animation: "floatDecorCSS 6s ease-in-out infinite",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />
          <img
            src={shape1}
            alt=""
            aria-hidden="true"
            className={`${styles.decorShape} ${styles.shapeChatBR}`}
            style={{
              animation: "floatDecorCSS 5.5s ease-in-out infinite",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />

          {/* PEMBUNGKUS KONTEN DALAM (Agar sudutnya tetap melengkung rapi) */}
          <div className={styles.cardInner}>
            <div className={styles.chatHeader}>
              <div className={styles.groupInfo}>
                <div className={styles.groupAvatar}>💻</div>
                <div>
                  <h3 className={styles.groupName}>Ruang Frontend Dev</h3>
                  <p className={styles.onlineStatus}>
                    <span className={styles.onlineDot}></span> 128 online
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.chatBody}>
              <div className={`${styles.bubble} ${styles.leftBubble}`}>
                <span className={styles.sender}>Faiz Faishal</span>
                <p>
                  Guys, ada yang paham cara fix error hydration di React 18? 😭
                </p>
              </div>

              <div className={`${styles.bubble} ${styles.rightBubble}`}>
                <span className={styles.sender}>Adyvka Pratama</span>
                <p>
                  Sepengalaman gue, Biasanya ada p di dalam p. Coba cek tag HTML
                  di dalam komponen lo.
                </p>
              </div>

              <div className={styles.typingIndicator}>
                <span>Fulanah is typing</span>
                <div className={styles.dots}>
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                </div>
              </div>
            </div>

            <div className={styles.chatInput}>
              <div className={styles.inputBox}>Ketik pesan...</div>
              <button className={styles.sendBtn}>➔</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
