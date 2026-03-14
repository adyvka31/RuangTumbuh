import { useTransform } from "framer-motion";

export const useFlowAnimation = (scrollYProgress, index) => {
  // Hitung antrian animasi berdasarkan urutan (index) kartu
  const sStart = index * 0.25;
  const sEnd = sStart + 0.2;

  // Transisi pergerakan Y, Opacity, dan Scale
  const y = useTransform(scrollYProgress, [sStart, sEnd], [250, 0]);
  const opacity = useTransform(scrollYProgress, [sStart, sEnd], [0, 1]);
  const scale = useTransform(scrollYProgress, [sStart, sEnd], [0.8, 1]);

  return { y, opacity, scale };
};
