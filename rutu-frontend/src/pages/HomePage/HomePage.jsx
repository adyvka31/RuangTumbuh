import React, { useRef } from "react";
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
import shape11 from "../../assets/shape11.svg";
import shape12 from "../../assets/shape12.svg";
import shape13 from "../../assets/shape13.svg";

const featuresData = [
  {
    id: 1,
    title: "Learn & Teach",
    desc: "Temukan tutor sebaya atau bagikan keahlianmu kepada komunitas untuk berkembang bersama.",
    color: "#ff5e62", // Kuning
    decorations: [
      { src: shape13, pos: styles.decTopLeft }, // Kiri Atas
      { src: shape1, pos: styles.decBottomRight }, // Kanan Bawah
    ],
  },
  {
    id: 2,
    title: "Community",
    desc: "Bergabung dengan ruang diskusi yang interaktif, penuh dukungan, dan menyenangkan.",
    color: "#4ade80", // Hijau
    decorations: [
      { src: shape10, pos: styles.decTopRight }, // Kanan Atas
      { src: shape3, pos: styles.decBottomLeft }, // Kiri Bawah
    ],
  },
  {
    id: 3,
    title: "Portofolio Dashboard",
    desc: "Pantau progres belajarmu, kumpulkan lencana, dan pamerkan pencapaian terbaikmu.",
    color: "#ff90e8", // Pink
    decorations: [
      { src: shape4, pos: styles.decBottomRight }, // Kanan Bawah
      { src: shape12, pos: styles.decTopLeft }, // Kiri Atas
    ],
  },
  {
    id: 4,
    title: "Calendar",
    desc: "Atur dan jadwalkan sesi belajarmu dengan sistem kalender yang terintegrasi penuh.",
    color: "#00f2fe", // Biru Cyan
    decorations: [
      { src: shape6, pos: styles.decTopRight }, // Kanan Atas
      { src: shape2, pos: styles.decBottomLeft }, // Kiri Bawah
    ],
  },
  {
    id: 5,
    title: "All On Ruang Tumbuh!",
    desc: "Semua fitur yang kamu butuhkan untuk belajar dan berkembang ada di sini.",
    color: "#ff5e62", // Merah
    decorations: [
      { src: shape9, pos: styles.decTopLeft }, // Kiri Atas
      { src: shape13, pos: styles.decBottomRight }, // Kanan Bawah
    ],
  },
];

export default function HomePage() {
  const { scrollY } = useScroll();

  const stackRef = useRef(null);
  const { scrollYProgress: stackProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  const yUpFast = useTransform(scrollY, [0, 600], [0, -500]);
  const yDownFast = useTransform(scrollY, [0, 600], [0, 500]);
  const yUpSlow = useTransform(scrollY, [0, 600], [0, -300]);
  const yDownSlow = useTransform(scrollY, [0, 600], [0, 300]);

  const xLeftFast = useTransform(scrollY, [0, 600], [0, -500]);
  const xRightFast = useTransform(scrollY, [0, 600], [0, 500]);
  const xLeftSlow = useTransform(scrollY, [0, 600], [0, -300]);
  const xRightSlow = useTransform(scrollY, [0, 600], [0, 300]);

  const yText = useTransform(scrollY, [0, 600], [0, 80]);

  // Data 40 Shape untuk memenuhi layar dengan jarak yang seimbang
  // Durasi (dur) diset antara 5 detik hingga 7.5 detik agar melayangnya sangat pelan
  const shapesData = [
    {
      id: 1,
      src: shape1,
      y: yUpFast,
      x: xLeftSlow,
      rot: -15,
      z: styles.shapeBack,
      cName: styles.s1,
      dur: 5,
    },
    {
      id: 2,
      src: shape2,
      y: yUpSlow,
      x: xRightFast,
      rot: 25,
      z: styles.shapeBack,
      cName: styles.s2,
      dur: 6.5,
    },
    {
      id: 3,
      src: shape3,
      y: yDownSlow,
      x: xLeftFast,
      rot: -40,
      z: styles.shapeBack,
      cName: styles.s3,
      dur: 7,
    },
    {
      id: 4,
      src: shape4,
      y: yDownFast,
      x: xRightSlow,
      rot: 10,
      z: styles.shapeBack,
      cName: styles.s4,
      dur: 5.5,
    },
    {
      id: 5,
      src: shape5,
      y: yUpSlow,
      x: xLeftFast,
      rot: -10,
      z: styles.shapeFront,
      cName: styles.s5,
      dur: 6,
    },
    {
      id: 6,
      src: shape6,
      y: yDownSlow,
      x: xRightFast,
      rot: 45,
      z: styles.shapeFront,
      cName: styles.s6,
      dur: 7.5,
    },
    {
      id: 7,
      src: shape7,
      y: yUpFast,
      x: xRightSlow,
      rot: -20,
      z: styles.shapeFront,
      cName: styles.s7,
      dur: 5.8,
    },
    {
      id: 8,
      src: shape8,
      y: yDownFast,
      x: xLeftSlow,
      rot: 10,
      z: styles.shapeFront,
      cName: styles.s8,
      dur: 5.2,
    },
    {
      id: 9,
      src: shape9,
      y: yUpFast,
      x: xLeftFast,
      rot: 30,
      z: styles.shapeFront,
      cName: styles.s9,
      dur: 6.8,
    },
    {
      id: 10,
      src: shape10,
      y: yDownFast,
      x: xRightFast,
      rot: -30,
      z: styles.shapeFront,
      cName: styles.s10,
      dur: 7.2,
    },
    {
      id: 11,
      src: shape1,
      y: yUpSlow,
      x: xRightSlow,
      rot: 80,
      z: styles.shapeBack,
      cName: styles.s11,
      dur: 5.8,
    },
    {
      id: 12,
      src: shape2,
      y: yDownFast,
      x: xLeftFast,
      rot: -80,
      z: styles.shapeFront,
      cName: styles.s12,
      dur: 6.1,
    },
    {
      id: 13,
      src: shape4,
      y: yUpFast,
      x: xLeftSlow,
      rot: 110,
      z: styles.shapeBack,
      cName: styles.s13,
      dur: 7.4,
    },
    {
      id: 14,
      src: shape5,
      y: yDownSlow,
      x: xRightFast,
      rot: -15,
      z: styles.shapeFront,
      cName: styles.s14,
      dur: 5.3,
    },
    {
      id: 15,
      src: shape7,
      y: yDownFast,
      x: xRightSlow,
      rot: 60,
      z: styles.shapeBack,
      cName: styles.s15,
      dur: 6.9,
    },
    {
      id: 16,
      src: shape8,
      y: yUpSlow,
      x: xLeftFast,
      rot: -120,
      z: styles.shapeFront,
      cName: styles.s16,
      dur: 5.7,
    },
    {
      id: 17,
      src: shape3,
      y: yUpFast,
      x: xRightFast,
      rot: 15,
      z: styles.shapeFront,
      cName: styles.s17,
      dur: 7.1,
    },
    {
      id: 18,
      src: shape6,
      y: yDownSlow,
      x: xLeftSlow,
      rot: 90,
      z: styles.shapeBack,
      cName: styles.s18,
      dur: 6.2,
    },
    {
      id: 19,
      src: shape3,
      y: yUpFast,
      x: xLeftFast,
      rot: 45,
      z: styles.shapeBack,
      cName: styles.s19,
      dur: 5.9,
    },
    {
      id: 20,
      src: shape4,
      y: yDownSlow,
      x: xRightFast,
      rot: -25,
      z: styles.shapeFront,
      cName: styles.s20,
      dur: 7.3,
    },
    {
      id: 21,
      src: shape5,
      y: yUpSlow,
      x: xRightSlow,
      rot: 135,
      z: styles.shapeBack,
      cName: styles.s21,
      dur: 6.4,
    },
    {
      id: 22,
      src: shape6,
      y: yDownFast,
      x: xLeftSlow,
      rot: -15,
      z: styles.shapeBack,
      cName: styles.s22,
      dur: 5.1,
    },
    {
      id: 23,
      src: shape7,
      y: yUpFast,
      x: xRightFast,
      rot: 75,
      z: styles.shapeFront,
      cName: styles.s23,
      dur: 6.7,
    },
    {
      id: 24,
      src: shape8,
      y: yDownFast,
      x: xRightSlow,
      rot: -90,
      z: styles.shapeBack,
      cName: styles.s24,
      dur: 7.8,
    },
    {
      id: 25,
      src: shape1,
      y: yUpSlow,
      x: xLeftSlow,
      rot: 180,
      z: styles.shapeFront,
      cName: styles.s25,
      dur: 5.6,
    },
    {
      id: 26,
      src: shape2,
      y: yDownSlow,
      x: xLeftFast,
      rot: 50,
      z: styles.shapeBack,
      cName: styles.s26,
      dur: 6.3,
    },
    {
      id: 27,
      src: shape5,
      y: yUpFast,
      x: xLeftSlow,
      rot: 200,
      z: styles.shapeFront,
      cName: styles.s27,
      dur: 7.6,
    },
    {
      id: 28,
      src: shape3,
      y: yDownFast,
      x: xRightFast,
      rot: -110,
      z: styles.shapeBack,
      cName: styles.s28,
      dur: 5.4,
    },
    {
      id: 29,
      src: shape6,
      y: yUpSlow,
      x: xRightFast,
      rot: 65,
      z: styles.shapeFront,
      cName: styles.s29,
      dur: 6.6,
    },
    {
      id: 30,
      src: shape4,
      y: yDownSlow,
      x: xLeftSlow,
      rot: -140,
      z: styles.shapeBack,
      cName: styles.s30,
      dur: 7.7,
    },
    {
      id: 31,
      src: shape9,
      y: yUpFast,
      x: xRightSlow,
      rot: 45,
      z: styles.shapeFront,
      cName: styles.s31,
      dur: 5.5,
    },
    {
      id: 32,
      src: shape10,
      y: yDownFast,
      x: xLeftFast,
      rot: -45,
      z: styles.shapeFront,
      cName: styles.s32,
      dur: 6.2,
    },
    {
      id: 33,
      src: shape7,
      y: yUpSlow,
      x: xLeftSlow,
      rot: 90,
      z: styles.shapeBack,
      cName: styles.s33,
      dur: 7.1,
    },
    {
      id: 34,
      src: shape8,
      y: yDownSlow,
      x: xRightSlow,
      rot: -90,
      z: styles.shapeBack,
      cName: styles.s34,
      dur: 5.8,
    },
    {
      id: 35,
      src: shape2,
      y: yUpFast,
      x: xLeftFast,
      rot: 15,
      z: styles.shapeFront,
      cName: styles.s35,
      dur: 6.9,
    },
    {
      id: 36,
      src: shape1,
      y: yDownFast,
      x: xRightFast,
      rot: -15,
      z: styles.shapeFront,
      cName: styles.s36,
      dur: 5.3,
    },
    {
      id: 37,
      src: shape5,
      y: yUpSlow,
      x: xRightSlow,
      rot: 120,
      z: styles.shapeBack,
      cName: styles.s37,
      dur: 7.5,
    },
    {
      id: 38,
      src: shape6,
      y: yDownSlow,
      x: xLeftSlow,
      rot: -120,
      z: styles.shapeBack,
      cName: styles.s38,
      dur: 6.4,
    },
    {
      id: 39,
      src: shape3,
      y: yUpFast,
      x: xRightFast,
      rot: 75,
      z: styles.shapeFront,
      cName: styles.s39,
      dur: 5.7,
    },
    {
      id: 40,
      src: shape4,
      y: yDownFast,
      x: xLeftFast,
      rot: -75,
      z: styles.shapeFront,
      cName: styles.s40,
      dur: 6.8,
    },
  ];

  return (
    <>
      {/* SECTION NAVBAR */}
      <Navbar />

      {/* SECTION HERO */}
      <section className={styles.hero}>
        <div className={styles.parallaxContainer}>
          {shapesData.map((shape) => (
            <motion.div
              key={shape.id}
              style={{ y: shape.y, x: shape.x }}
              className={`${styles.shapeWrapper} ${shape.z} ${shape.cName}`}
            >
              <motion.img
                src={shape.src}
                style={{ rotate: shape.rot }}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: shape.dur,
                  ease: "easeInOut",
                }}
                className={styles.shapeImg}
              />
            </motion.div>
          ))}

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

      {/* SECTION TEXT BERJALAN */}
      <section className={styles.marqueeSection}>
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            <span className={styles.marqueeText}>
              RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
            </span>
            <span className={styles.marqueeText}>
              RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
            </span>
            <span className={styles.marqueeText}>
              RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
            </span>
          </div>
          <div className={styles.marqueeContent}>
            <span className={styles.marqueeText}>
              RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
            </span>
            <span className={styles.marqueeText}>
              RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
            </span>
            <span className={styles.marqueeText}>
              RUANG TUMBUH ✦ LEARN, GROW, AND EXPLORE TOGETHER ✦{" "}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION SCROLL STACK */}
      <section className={styles.stackSection} ref={stackRef}>
        <div className={styles.stackWrapper}>
          {featuresData.map((feat, i) => {
            const N = featuresData.length;
            const totalPhases = 2 * N - 1;

            // Tentukan titik mulainya setiap fase berdasarkan urutan (index)
            const eStart = (2 * i - 1) / totalPhases; // Mulai masuk
            const eEnd = (2 * i) / totalPhases; // Selesai masuk
            const sStart = (2 * i) / totalPhases; // Mulai mengecil
            const sEnd = (2 * i + 1) / totalPhases; // Selesai mengecil

            const targetScale = 1.05 - (N - 1 - i) * 0.03;

            let scaleInput, scaleOutput;
            let yInput, yOutput;

            if (i === 0) {
              scaleInput = [0, sEnd, 1];
              scaleOutput = [1.1, targetScale, targetScale];

              yInput = [0, 1];
              yOutput = [0, 0];
            } else if (i === N - 1) {
              scaleInput = [0, sStart, 1];
              scaleOutput = [1.1, 1.1, targetScale];

              yInput = [0, eStart, eEnd, 1];
              yOutput = [50, 50, 0, 0]; // Efek slide-up dari bawah 50px
            } else {
              scaleInput = [0, sStart, sEnd, 1];
              scaleOutput = [1.1, 1.1, targetScale, targetScale];

              yInput = [0, eStart, eEnd, 1];
              yOutput = [50, 50, 0, 0];
            }

            // Terapkan mapping ke useTransform
            const scale = useTransform(stackProgress, scaleInput, scaleOutput);
            const y = useTransform(stackProgress, yInput, yOutput);

            return (
              <div className={styles.cardStickyContainer} key={feat.id}>
                <motion.div
                  className={styles.cardContent}
                  style={{
                    backgroundColor: feat.color,
                    scale, // Pengecilan sekuensial
                    y, // Memberi efek slide-up saat masuk
                    top: `${i * 35}px`,
                  }}
                >
                  <div className={styles.cardTextWrapper}>
                    <h3>{feat.title}</h3>
                    <p>{feat.desc}</p>
                  </div>

                  {feat.decorations.map((dec, idx) => (
                    <motion.img
                      key={idx}
                      src={dec.src}
                      alt="Card Decoration"
                      className={`${styles.cardShape} ${dec.pos}`}
                      animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 4 + i * 0.5 + idx * 0.5,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.dummySection}>
        <h2>Lanjutkan Perjalanan Tumbuhmu di Sini...</h2>
      </section>
    </>
  );
}
