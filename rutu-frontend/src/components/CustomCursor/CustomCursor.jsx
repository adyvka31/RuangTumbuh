import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
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

    // Logika untuk menggerakkan kursor (performa tinggi dengan translate3d)
    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    };

    // Global Event Delegation untuk Hover
    const handleMouseOver = (e) => {
      // Menambahkan class untuk elemen dengan logo/dashboard di Navbar agar kursor juga hilang
      if (
        e.target.closest(
          "a, button, input, textarea, select, .interactable",
        )
      ) {
        cursor.classList.add(styles.cursorHide);
      }
    };

    // Mendeteksi jika kursor keluar dari elemen interaktif
    const handleMouseOut = (e) => {
      if (
        e.target.closest(
          "a, button, input, textarea, select, .interactable",
        )
      ) {
        cursor.classList.remove(styles.cursorHide);
      }
    };

    // Mendaftarkan event listener
    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      // Membersihkan event listener saat komponen dilepas (unmount)
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isTouchDevice]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <div className={styles.cursor} ref={cursorRef}>
      ✦
    </div>
  );
}

