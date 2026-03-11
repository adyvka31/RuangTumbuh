import { useScroll, useTransform } from "framer-motion";

export const useParallax = () => {
  const { scrollY } = useScroll();

  const motionValues = {
    upFast: useTransform(scrollY, [0, 600], [0, -500]),
    downFast: useTransform(scrollY, [0, 600], [0, 500]),
    upSlow: useTransform(scrollY, [0, 600], [0, -300]),
    downSlow: useTransform(scrollY, [0, 600], [0, 300]),
    leftFast: useTransform(scrollY, [0, 600], [0, -500]),
    rightFast: useTransform(scrollY, [0, 600], [0, 500]),
    leftSlow: useTransform(scrollY, [0, 600], [0, -300]),
    rightSlow: useTransform(scrollY, [0, 600], [0, 300]),
  };

  const yText = useTransform(scrollY, [0, 600], [0, 80]);

  return { motionValues, yText };
};
