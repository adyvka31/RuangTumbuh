import React from "react";
import HeroLayout from "@/pages/HomePage/Hero/HeroLayout";
import MarqueeLayout from "@/pages/HomePage/Marquee/MarqueeLayout";
import StackLayout from "@/pages/HomePage/StackCard/StackLayout";
import styles from "./HomePage.module.css";
import MainLayout from "@/layouts/MainLayout/MainLayout";

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
