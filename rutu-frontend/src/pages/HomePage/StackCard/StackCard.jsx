import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useSequentialScroll } from "@/hooks/useSequentialScroll";
import { FEATURES_DATA } from "@/constants/stackData";
import { useMatterPhysics } from "@/hooks/useMatterPhysics";
import styles from "./StackLayout.module.css";

export default function StackSection() {
  const { scrollRef, scrollYProgress } = useSequentialScroll();
  const sceneRef = useRef(null);

  useMatterPhysics(sceneRef);

  return (
    <section className={styles.stackSection} ref={scrollRef} id="fitur">
      <div className={styles.stackWrapper}>
        {FEATURES_DATA.map((feat, i) => {
          const N = FEATURES_DATA.length;
          const tPhases = 2 * N - 1;
          const targetScale = 1.05 - (N - 1 - i) * 0.03;

          const sStart = (2 * i) / tPhases;
          const sEnd = (2 * i + 1) / tPhases;
          const eStart = (2 * i - 1) / tPhases;
          const eEnd = (2 * i) / tPhases;

          const scale = useTransform(
            scrollYProgress,
            [0, sStart, sEnd || 1, 1],
            i === 0
              ? [1.1, 1.1, targetScale, targetScale]
              : [1.1, 1.1, targetScale, targetScale],
          );
          const y = useTransform(
            scrollYProgress,
            [0, Math.max(0, eStart), eEnd || 1, 1],
            i === 0 ? [0, 0, 0, 0] : [50, 50, 0, 0],
          );

          const isLastCard = i === N - 1;

          return (
            <div className={styles.cardStickyContainer} key={feat.id}>
              <motion.div
                className={styles.cardContent}
                style={{
                  backgroundColor: feat.color,
                  scale,
                  y,
                  top: `${i * 35}px`,
                }}
              >
                {isLastCard ? (
                  <div className={styles.lastCardBody}>
                    {/* -- DEKORASI KILAUAN --- */}
                    <div
                      className={`${styles.lastCardKilau} ${styles.kilauKiriTop}`}
                    >
                      ✦
                    </div>
                    <div
                      className={`${styles.lastCardKilau} ${styles.kilauKananBottom}`}
                    >
                      ✦
                    </div>

                    <span className={styles.lastCardBadge}>
                      ✦ THE GRAND FINALE ✦
                    </span>

                    <div className={styles.titleWrapper}>
                      <h3 className={styles.lastCardTitle}>{feat.title}</h3>
                    </div>

                    <div className={styles.lastCardDescBox}>
                      <p>{feat.desc}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.cardBackground}>
                      <span className={styles.cardNumber}>0{i + 1}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.topContent}>
                        <span className={styles.featureBadge}>
                          ✦ Feature 0{i + 1}
                        </span>
                        <h3>{feat.title}</h3>
                      </div>

                      <div className={styles.bottomContent}>
                        <div className={styles.descBox}>
                          <p>{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {feat.decorations.map((dec, idx) => (
                  <img
                    key={`dec-${idx}`}
                    src={dec.src}
                    alt=""
                    aria-hidden="true"
                    className={`${styles.cardShape} ${styles[dec.pos]}`}
                    style={{
                      animation: `floatDecorCSS ${
                        4 + i * 0.5 + idx * 0.5
                      }s ease-in-out infinite`,
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>

      <div
        ref={sceneRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 5,
          pointerEvents: "auto",
          overflow: "hidden",
        }}
      />
    </section>
  );
}
