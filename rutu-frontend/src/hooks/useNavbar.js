import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScroll, useMotionValueEvent } from "framer-motion";

export const useNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStartup, setIsStartup] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Pantau scroll untuk efek navbar menyatu
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Timer animasi startup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStartup(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fungsi navigasi yang mulus
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isMerged = isStartup || isScrolled;

  return {
    isMenuOpen,
    isChatOpen,
    setIsChatOpen,
    isMerged,
    toggleMenu,
    closeMenu,
    handleScrollTo,
    navigate,
  };
};
