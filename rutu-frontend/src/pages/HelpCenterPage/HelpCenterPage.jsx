import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./HelpCenterPage.module.css";
import {
  FiSearch,
  FiBook,
  FiCreditCard,
  FiSettings,
  FiMessageCircle,
  FiChevronDown,
  FiAlertCircle,
} from "react-icons/fi";

import shape10 from "@/assets/shape10.svg";
import shape11 from "@/assets/shape11.svg";

// --- DUMMY DATA ---
const helpCategories = [
  {
    id: 1,
    title: "Panduan Belajar",
    icon: <FiBook />,
    color: "#38BDF8",
    desc: "Cara memulai kursus dan menggunakan fitur kelas.",
  },
  {
    id: 2,
    title: "Pembayaran & Saldo",
    icon: <FiCreditCard />,
    color: "#FACC15",
    desc: "Masalah transaksi, invoice, dan penarikan saldo.",
  },
  {
    id: 3,
    title: "Akun & Keamanan",
    icon: <FiSettings />,
    color: "#A78BFA",
    desc: "Lupa password, verifikasi, dan pengaturan profil.",
  },
  {
    id: 4,
    title: "Kendala Teknis",
    icon: <FiAlertCircle />,
    color: "#F472B6",
    desc: "Bug aplikasi, error akses, dan masalah teknis lainnya.",
  },
];

const faqs = [
  {
    id: 1,
    question: "Bagaimana cara mencairkan saldo pendapatan mentor?",
    answer:
      "Anda dapat mencairkan saldo melalui menu 'Dompet'. Minimal penarikan adalah Rp 100.000 dan proses memakan waktu 1-3 hari kerja ke rekening bank terdaftar.",
  },
  {
    id: 2,
    question:
      "Apakah saya bisa menjadwal ulang sesi mentoring yang sudah dibooking?",
    answer:
      "Ya, Anda bisa menjadwal ulang maksimal 1x24 jam sebelum sesi dimulai. Masuk ke menu 'Jadwal', pilih sesi terkait, dan klik tombol 'Jadwalkan Ulang'.",
  },
  {
    id: 3,
    question: "Apa yang terjadi jika saya lupa password akun saya?",
    answer:
      "Di halaman login, klik 'Lupa Password'. Kami akan mengirimkan tautan reset ke email yang terdaftar. Jika email tidak masuk, periksa folder spam Anda.",
  },
  {
    id: 4,
    question: "Sertifikat kelulusan kursus belum muncul, apa solusinya?",
    answer:
      "Pastikan Anda telah menonton seluruh video materi hingga selesai (progress 100%) dan telah lulus kuis akhir. Sertifikat biasanya ter-generate otomatis dalam 10 menit.",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null); // Menyimpan ID FAQ yang sedang dibuka

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  // Filter FAQ berdasarkan pencarian
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout title="Pusat Bantuan">
      <div className={styles.container}>
        {/* --- HERO & SEARCH --- */}
        <motion.div
          className={styles.heroBanner}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* DEKORASI BENTUK BERGERAK (SHAPES ASLI) */}
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

        {/* --- KATEGORI BANTUAN --- */}
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

        {/* --- FAQ ACCORDION --- */}
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
                  className={`${styles.accordionItem} ${activeFaq === faq.id ? styles.accordionActive : ""}`}
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

        {/* --- CONTACT SUPPORT --- */}
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
