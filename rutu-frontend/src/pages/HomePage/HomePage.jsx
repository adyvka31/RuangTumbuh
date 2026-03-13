import React from "react";
import HeroLayout from "@/pages/HomePage/HeroLayout/HeroLayout";
import MarqueeLayout from "@/pages/HomePage/MarqueeLayout/MarqueeLayout";
import StackLayout from "@/pages/HomePage/StackLayout/StackLayout";
import styles from "./HomePage.module.css";
import MainLayout from "@/pages/HomePage/MainLayout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroLayout />

      <MarqueeLayout />

      <StackLayout />

      <section className={styles.dummySection}>
        <h2>Lanjutkan Perjalanan Tumbuhmu di Sini...</h2>
      </section>
    </MainLayout>
  );
}
