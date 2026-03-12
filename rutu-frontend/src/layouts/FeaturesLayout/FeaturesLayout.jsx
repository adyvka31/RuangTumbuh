import React from "react";
import { motion } from "framer-motion";
import styles from "./FeaturesLayout.module.css";

// Import Aset Shapes pakai Alias @assets
import ShapeYellow from "@assets/shape1.svg"; // Sesuaikan nama file aslinya
import ShapePink from "@assets/shape2.svg";   // Sesuaikan nama file aslinya
import ShapeGreen from "@assets/shape3.svg";  // Sesuaikan nama file aslinya
import ShapeBlue from "@assets/shape4.svg";   // Sesuaikan nama file aslinya

const featuresData = [
    {
        id: 1,
        color: "#FF9800", // Orange
        title: "Belajar Bareng Bestie Baru",
        desc: "Gak usah pusing sendirian! Ketemu tutor sebaya yang frekuensinya sama, bikin belajar jadi sesi nongkrong yang produktif.",
    },
    {
        id: 2,
        color: "#FFEB3B", // Kuning
        title: "Atur Waktu Anti Ribet",
        desc: "Kalender otomatis yang jagain jadwal kamu. Fokus ke upgrade skill, biarin kita yang urus pengingat dan manajemen sesinya.",
    },
    {
        id: 3,
        color: "#F06292", // Pink
        title: "Lihat Dirimu Bertumbuh",
        desc: "Tiap langkah kecilmu ada jejaknya. Kumpulin badge keren dan pantau progres belajarmu lewat dashboard yang interaktif banget.",
    },
    {
        id: 4,
        color: "#03A9F4", // Biru
        title: "Akses Skill Tanpa Batas",
        desc: "Dari coding sampai desain, semua materi ada di genggaman. Gali potensi tersembunyimu dan jadi versi terbaik dari dirimu sendiri.",
    },
];

// --- Konfigurasi Animasi Framer Motion ---

// Container untuk Stagger Effect (kartu muncul bergantian)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25, // Jeda antar kartu
        },
    },
};

// Animasi Tiap Kartu (muncul dari bawah)
const cardVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1], // Cubic-bezier untuk gerakan yang smooth
        },
    },
};

export default function FeaturesLayout() {
    return (
        <section className={styles.featuresSection}>
            {/* --- Bagian Header --- */}
            <div className={styles.header}>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Benefits
                </motion.h2>
                <p>Features that help you learn, teach, and share your skills with others easily</p>
            </div>

            {/* --- Grid Kartu dengan Animasi --- */}
            <motion.div
                className={styles.cardGrid}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }} // Lower threshold for mobile compatibility
            >
                {featuresData.map((feature) => (
                    <motion.div
                        key={feature.id}
                        className={styles.card}
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.05,
                            rotate: feature.id % 2 === 0 ? 1.5 : -1.5, // Efek miring dikit pas hover
                            boxShadow: "12px 12px 0px #000", // Shadow jadi lebih tebal pas hover
                            transition: { duration: 0.3, ease: "easeInOut" },
                        }}
                    >
                        {/* Setengah Lingkaran di Atas */}
                        <div
                            className={styles.halfCircle}
                            style={{ backgroundColor: feature.color }}
                        ></div>

                        {/* Konten Kartu */}
                        <div className={styles.cardContent}>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* --- Bagian Banner Biru & Shapes Dekoratif --- */}
            <div className={styles.blueBannerWrapper}>
                <div className={styles.blueBanner}></div>

                {/* Elemen Shapes Dekoratif - Posisikan Absolut */}
                <img src={ShapeYellow} alt="" className={`${styles.decorShape} ${styles.shapeYellow}`} />
                <img src={ShapePink} alt="" className={`${styles.decorShape} ${styles.shapePink}`} />
                <img src={ShapeGreen} alt="" className={`${styles.decorShape} ${styles.shapeGreen}`} />
                <img src={ShapeBlue} alt="" className={`${styles.decorShape} ${styles.shapeBlue}`} />
            </div>
        </section>
    );
}