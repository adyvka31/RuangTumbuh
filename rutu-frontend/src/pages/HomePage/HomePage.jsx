import React from "react";
import Hero from "@/pages/HomePage/Hero/Hero";
import Marquee from "@/pages/HomePage/Marquee/Marquee";
import StackCard from "@/pages/HomePage/StackCard/StackCard";
import CalendarSection from "@/pages/HomePage/CalendarSection/CalendarSection";
import styles from "./HomePage.module.css";
import MainLayout from "@/layouts/MainLayout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />

      <Marquee />

      <StackCard />

      <CalendarSection />

      <section className={styles.dummySection}>
        <h2>Lanjutkan Perjalanan Tumbuhmu di Sini...</h2>
      </section>
    </MainLayout>
  );
}
