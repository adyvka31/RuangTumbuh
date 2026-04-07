import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./HelpCenterPage.module.css";

import {
  FiSearch,
  FiMessageCircle,
  FiChevronDown,
  FiAlertCircle,
} from "react-icons/fi";

import shape10 from "@/assets/shape10.svg";
import shape11 from "@/assets/shape11.svg";

import { helpCategories } from "@/constants/helpData";
import { useHelpCenter } from "@/hooks/useHelpCenter";

export default function HelpCenterPage() {
  const { searchQuery, setSearchQuery, activeFaq, toggleFaq, filteredFaqs } =
    useHelpCenter();

  return (
    <DashboardLayout title="Pusat Bantuan">
      <div className={styles.container}>
        {/* HERO */}
        <motion.div
          className={styles.heroBanner}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className={styles.bannerDecor}>
            <motion.img
              src={shape10}
              alt="Dekorasi Kiri"
              className={styles.shapeLeft}
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={shape11}
              alt="Dekorasi Kanan"
              className={styles.shapeRight}
              animate={{ y: [0, -20, 0], rotate: [0, -10, 10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>

          <div className={styles.heroContent}>
            <h2>Halo, ada yang bisa kami bantu?</h2>
            <p>
              Cari solusi untuk masalah Anda, atau jelajahi artikel panduan di
              bawah ini.
            </p>

            <div className={styles.searchContainer}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Ketik masalah atau pertanyaan Anda di sini..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* CATEGORY */}
        {!searchQuery && (
          <div className={styles.categorySection}>
            <div className={styles.categoryGrid}>
              {helpCategories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  className={styles.categoryCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={styles.catIconWrap}
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </div>

                  <div className={styles.catText}>
                    <h4>{cat.title}</h4>
                    <p>{cat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h3>
              {searchQuery
                ? `Hasil Pencarian: "${searchQuery}"`
                : "Pertanyaan Populer (FAQ)"}
            </h3>
          </div>

          <div className={styles.accordionContainer}>
            {filteredFaqs.length === 0 ? (
              <div className={styles.emptyState}>
                <FiAlertCircle size={40} color="#999" />
                <p>
                  Tidak ada jawaban yang cocok untuk "{searchQuery}". Silakan
                  coba kata kunci lain.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`${styles.accordionItem} ${
                    activeFaq === faq.id ? styles.accordionActive : ""
                  }`}
                >
                  <button
                    className={styles.accordionBtn}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className={styles.questionText}>{faq.question}</span>

                    <motion.div
                      className={styles.chevronIcon}
                      animate={{ rotate: activeFaq === faq.id ? 180 : 0 }}
                    >
                      <FiChevronDown />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {activeFaq === faq.id && (
                      <motion.div
                        className={styles.accordionContentWrapper}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.accordionContent}>
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CONTACT */}
        <motion.div
          className={styles.contactSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.contactText}>
            <h3>Masih butuh bantuan? 🚨</h3>
            <p>
              Jika jawaban di atas tidak menyelesaikan masalah Anda, tim support
              kami siap membantu 24/7.
            </p>
          </div>

          <button className={styles.contactBtn}>
            <FiMessageCircle /> Hubungi Support
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
