import { useRef } from "react";
import { useScroll } from "framer-motion";

export const useSequentialScroll = () => {
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return { scrollRef, scrollYProgress };
};
