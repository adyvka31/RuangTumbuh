import React from "react";
import HeroLayout from "@layouts/HeroLayout/HeroLayout";
import MarqueeLayout from "@layouts/MarqueeLayout/MarqueeLayout";
import StackLayout from "@layouts/StackLayout/StackLayout";
import styles from "./HomePage.module.css";
import MainLayout from "@layouts/MainLayout/MainLayout";
import FeaturesLayout from "@layouts/FeaturesLayout/FeaturesLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroLayout />

      <MarqueeLayout />

      <StackLayout />

      <FeaturesLayout />

      <section className={styles.dummySection}>
        <h2>Lanjutkan Perjalanan Tumbuhmu di Sini...</h2>
      </section>
    </MainLayout>
  );
}
