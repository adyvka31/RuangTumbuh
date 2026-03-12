import React from "react";
import HeroLayout from "@/layouts/Home/HeroLayout/HeroLayout";
import MarqueeLayout from "@/layouts/Home/MarqueeLayout/MarqueeLayout";
import StackLayout from "@/layouts/Home/StackLayout/StackLayout";
import styles from "./HomePage.module.css";
import MainLayout from "@/layouts/Home/MainLayout/MainLayout";

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
