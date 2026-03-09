import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./HomePage.module.css";

// Mengimpor semua 10 aset gambar
import textLogo from "../../assets/text-logo.svg";
import shape1 from "../../assets/shape1.svg";
import shape2 from "../../assets/shape2.svg";
import shape3 from "../../assets/shape3.svg";
import shape4 from "../../assets/shape4.svg";
import shape5 from "../../assets/shape5.svg";
import shape6 from "../../assets/shape6.svg";
import shape7 from "../../assets/shape7.svg";
import shape8 from "../../assets/shape8.svg";
import shape9 from "../../assets/shape9.svg";
import shape10 from "../../assets/shape10.svg";

export default function HomePage() {
  const { scrollY } = useScroll();

  // Memetakan pergerakan menjauh dari tengah layar
  const yUpFast = useTransform(scrollY, [0, 600], [0, -500]);
  const yDownFast = useTransform(scrollY, [0, 600], [0, 500]);
  const yUpSlow = useTransform(scrollY, [0, 600], [0, -300]);
  const yDownSlow = useTransform(scrollY, [0, 600], [0, 300]);

  const xLeftFast = useTransform(scrollY, [0, 600], [0, -500]);
  const xRightFast = useTransform(scrollY, [0, 600], [0, 500]);
  const xLeftSlow = useTransform(scrollY, [0, 600], [0, -300]);
  const xRightSlow = useTransform(scrollY, [0, 600], [0, 300]);

  const yText = useTransform(scrollY, [0, 600], [0, 80]);

  return (
    <>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.parallaxContainer}>
          {/* --- SHAPE DI BELAKANG TEKS (z-index: 5) --- */}
          <motion.img
            style={{ y: yUpFast, x: xLeftSlow, rotate: -15 }}
            src={shape1}
            className={`${styles.shapeBack} ${styles.s1}`}
          />
          <motion.img
            style={{ y: yUpSlow, x: xRightFast, rotate: 25 }}
            src={shape2}
            className={`${styles.shapeBack} ${styles.s2}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xLeftFast, rotate: -40 }}
            src={shape3}
            className={`${styles.shapeBack} ${styles.s3}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xRightSlow, rotate: 10 }}
            src={shape4}
            className={`${styles.shapeBack} ${styles.s4}`}
          />

          {/* --- SHAPE DI DEPAN TEKS (z-index: 15) --- */}
          <motion.img
            style={{ y: yUpSlow, x: xLeftFast, rotate: -10 }}
            src={shape5}
            className={`${styles.shapeFront} ${styles.s5}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xRightFast, rotate: 45 }}
            src={shape6}
            className={`${styles.shapeFront} ${styles.s6}`}
          />
          <motion.img
            style={{ y: yUpFast, x: xRightSlow, rotate: -20 }}
            src={shape7}
            className={`${styles.shapeFront} ${styles.s7}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xLeftSlow, rotate: 15 }}
            src={shape8}
            className={`${styles.shapeFront} ${styles.s8}`}
          />

          {/* --- SHAPE KHUSUS 9 & 10 --- */}
          <motion.img
            style={{ y: yUpFast, x: xLeftFast, rotate: 30 }}
            src={shape9}
            className={`${styles.shapeFront} ${styles.s9}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xRightFast, rotate: -30 }}
            src={shape10}
            className={`${styles.shapeFront} ${styles.s10}`}
          />

          {/* === EKSTRA RAMAI: DUPLIKASI SHAPE (z-index campuran) === */}
          {/* Kita putar sudutnya agar tidak terlihat persis sama */}
          <motion.img
            style={{ y: yUpSlow, x: xRightSlow, rotate: 80 }}
            src={shape1}
            className={`${styles.shapeBack} ${styles.s11}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xLeftFast, rotate: -80 }}
            src={shape2}
            className={`${styles.shapeFront} ${styles.s12}`}
          />
          <motion.img
            style={{ y: yUpFast, x: xLeftSlow, rotate: 110 }}
            src={shape4}
            className={`${styles.shapeBack} ${styles.s13}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xRightFast, rotate: -15 }}
            src={shape5}
            className={`${styles.shapeFront} ${styles.s14}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xRightSlow, rotate: 60 }}
            src={shape7}
            className={`${styles.shapeBack} ${styles.s15}`}
          />
          <motion.img
            style={{ y: yUpSlow, x: xLeftFast, rotate: -120 }}
            src={shape8}
            className={`${styles.shapeFront} ${styles.s16}`}
          />
          <motion.img
            style={{ y: yUpFast, x: xRightFast, rotate: 15 }}
            src={shape3}
            className={`${styles.shapeFront} ${styles.s17}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xLeftSlow, rotate: 90 }}
            src={shape6}
            className={`${styles.shapeBack} ${styles.s18}`}
          />

          <motion.img
            style={{ y: yUpFast, x: xLeftFast, rotate: 45 }}
            src={shape3}
            className={`${styles.shapeBack} ${styles.s19}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xRightFast, rotate: -25 }}
            src={shape4}
            className={`${styles.shapeFront} ${styles.s20}`}
          />
          <motion.img
            style={{ y: yUpSlow, x: xRightSlow, rotate: 135 }}
            src={shape5}
            className={`${styles.shapeBack} ${styles.s21}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xLeftSlow, rotate: -15 }}
            src={shape6}
            className={`${styles.shapeBack} ${styles.s22}`}
          />
          <motion.img
            style={{ y: yUpFast, x: xRightFast, rotate: 75 }}
            src={shape7}
            className={`${styles.shapeFront} ${styles.s23}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xRightSlow, rotate: -90 }}
            src={shape8}
            className={`${styles.shapeBack} ${styles.s24}`}
          />
          <motion.img
            style={{ y: yUpSlow, x: xLeftSlow, rotate: 180 }}
            src={shape1}
            className={`${styles.shapeFront} ${styles.s25}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xLeftFast, rotate: 50 }}
            src={shape2}
            className={`${styles.shapeBack} ${styles.s26}`}
          />
          <motion.img
            style={{ y: yUpFast, x: xLeftSlow, rotate: 200 }}
            src={shape5}
            className={`${styles.shapeFront} ${styles.s27}`}
          />
          <motion.img
            style={{ y: yDownFast, x: xRightFast, rotate: -110 }}
            src={shape3}
            className={`${styles.shapeBack} ${styles.s28}`}
          />
          <motion.img
            style={{ y: yUpSlow, x: xRightFast, rotate: 65 }}
            src={shape6}
            className={`${styles.shapeFront} ${styles.s29}`}
          />
          <motion.img
            style={{ y: yDownSlow, x: xLeftSlow, rotate: -140 }}
            src={shape4}
            className={`${styles.shapeBack} ${styles.s30}`}
          />
          {/* TEKS TITLE DI TENGAH */}
          <motion.div style={{ y: yText }} className={styles.content}>
            <img
              src={textLogo}
              alt="Ruang Tumbuh"
              className={styles.textLogo}
            />
            <p className={styles.subtitle}>Learn, Grow, and Explore Together</p>
          </motion.div>
        </div>
      </section>

      {/* SECTION DUMMY */}
      <section className={styles.dummySection}>
        <h2>Lanjutkan Perjalanan Tumbuhmu di Sini...</h2>
      </section>
    </>
  );
}
