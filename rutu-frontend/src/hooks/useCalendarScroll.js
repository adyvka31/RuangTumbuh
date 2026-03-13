import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export const useCalendarScroll = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Logika rotasi kalender saat scroll
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 5, -5]);

  return { containerRef, rotate };
};
