import shape1 from "../assets/shape1.svg";
import shape2 from "../assets/shape2.svg";
import shape3 from "../assets/shape3.svg";
import shape4 from "../assets/shape4.svg";
import shape6 from "../assets/shape6.svg";
import shape9 from "../assets/shape9.svg";
import shape10 from "../assets/shape10.svg";
import shape12 from "../assets/shape12.svg";
import shape13 from "../assets/shape13.svg";

export const FEATURES_DATA = [
  {
    id: 1,
    title: "Learn & Teach",
    desc: "Temukan tutor sebaya atau bagikan keahlianmu kepada komunitas untuk berkembang bersama.",
    color: "#ff5e62",
    decorations: [
      { src: shape13, pos: "decTopLeft" },
      { src: shape1, pos: "decBottomRight" },
    ],
  },
  {
    id: 2,
    title: "Community",
    desc: "Bergabung dengan ruang diskusi yang interaktif, penuh dukungan, dan menyenangkan.",
    color: "#4ade80",
    decorations: [
      { src: shape10, pos: "decTopRight" },
      { src: shape3, pos: "decBottomLeft" },
    ],
  },
  {
    id: 3,
    title: "Portofolio Dashboard",
    desc: "Pantau progres belajarmu, kumpulkan lencana, dan pamerkan pencapaian terbaikmu.",
    color: "#ff90e8",
    decorations: [
      { src: shape4, pos: "decBottomRight" },
      { src: shape12, pos: "decTopLeft" },
    ],
  },
  {
    id: 4,
    title: "Calendar",
    desc: "Atur dan jadwalkan sesi belajarmu dengan sistem kalender yang terintegrasi penuh.",
    color: "#00f2fe",
    decorations: [
      { src: shape6, pos: "decTopRight" },
      { src: shape2, pos: "decBottomLeft" },
    ],
  },
  {
    id: 5,
    title: "All On Ruang Tumbuh!",
    desc: "Semua fitur yang kamu butuhkan untuk belajar dan berkembang ada di sini.",
    color: "#ff5e62",
    decorations: [
      { src: shape9, pos: "decTopLeft" },
      { src: shape13, pos: "decBottomRight" },
    ],
  },
];
