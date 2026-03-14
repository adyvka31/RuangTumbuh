import React from "react";
import Hero from "@/pages/HomePage/Hero/Hero";
import Marquee from "@/pages/HomePage/Marquee/Marquee";
import StackCard from "@/pages/HomePage/StackCard/StackCard";
import CalendarSection from "@/pages/HomePage/CalendarSection/CalendarSection";
import FlowSection from "@/pages/HomePage/FlowSection/FlowSection";
import CommunitySection from "@/pages/HomePage/CommunitySection/CommunitySection";
import MainLayout from "@/layouts/MainLayout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />

      <Marquee />

      <StackCard />

      <CalendarSection />

      <FlowSection />

      <CommunitySection />
    </MainLayout>
  );
}
