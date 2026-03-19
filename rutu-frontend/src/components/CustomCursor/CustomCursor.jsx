import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    setIsTouchDevice(checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    };

    const handleMouseOver = (e) => {
      if (
        e.target.closest(
          "a, button, input, textarea, select, [role='button'], .interactable",
        )
      ) {
        cursor.classList.add(styles.cursorHide);
      }
    };

    const handleMouseOut = (e) => {
      if (
        e.target.closest(
          "a, button, input, textarea, select, [role='button'], .interactable",
        )
      ) {
        cursor.classList.remove(styles.cursorHide);
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    // HAPUS style={{ opacity: ... }} agar selalu muncul
    <div className={styles.cursor} ref={cursorRef}>
      ✦
    </div>
  );
}
