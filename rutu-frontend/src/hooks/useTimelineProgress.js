import { useRef } from "react";
import { useScroll } from "framer-motion";

export const useTimelineProgress = () => {
  const itemRef = useRef(null);

  // Logika pengisian garis vertikal saat mencapai 60% layar
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 60%", "end 60%"],
  });

  return { itemRef, scrollYProgress };
};
