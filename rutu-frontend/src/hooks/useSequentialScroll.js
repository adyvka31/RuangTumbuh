import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";

export const useSequentialScroll = () => {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Tambahkan efek inertia pada progress scroll (0 hingga 1)
  // Stiffness dan damping dinaikkan agar kartu tidak memantul terlalu jauh
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // Kembalikan smoothProgress sebagai scrollYProgress
  return { scrollRef, scrollYProgress: smoothProgress };
};