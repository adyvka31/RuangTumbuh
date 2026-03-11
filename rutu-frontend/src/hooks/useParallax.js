import { useScroll, useTransform, useSpring } from "framer-motion";

export const useParallax = () => {
  const { scrollY } = useScroll();

  // stiffness = kecepatan menyusul, damping = rem (agar tidak mantul)
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 90,
    damping: 25,
    mass: 0.5,
  });

  const motionValues = {
    upFast: useTransform(smoothScrollY, [0, 600], [0, -500]),
    downFast: useTransform(smoothScrollY, [0, 600], [0, 500]),
    upSlow: useTransform(smoothScrollY, [0, 600], [0, -300]),
    downSlow: useTransform(smoothScrollY, [0, 600], [0, 300]),
    leftFast: useTransform(smoothScrollY, [0, 600], [0, -500]),
    rightFast: useTransform(smoothScrollY, [0, 600], [0, 500]),
    leftSlow: useTransform(smoothScrollY, [0, 600], [0, -300]),
    rightSlow: useTransform(smoothScrollY, [0, 600], [0, 300]),
  };

  const yText = useTransform(smoothScrollY, [0, 600], [0, 80]);

  return { motionValues, yText };
};
