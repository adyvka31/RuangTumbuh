import { ASSETS } from "./heroData";

// Data murni: Hanya berisi ID Shape dan Rotasi visualnya.
const RAW_FALLEN = [
  [9, 15],
  [11, -20],
  [13, 45],
  [10, 10],
  [6, -35],
  [12, 25],
  [6, 75],
  [9, -15],
  [11, 50],
  [13, -60],
  [9, 25],
  [10, -45],
  [12, 15],
  [13, 80],
  [9, -20],
  [11, 30],
  [10, -40],
  [6, 12],
  [11, -70],
  [9, 35],
  [11, -15],
  [13, 80],
  [9, -25],
  [10, 45],
  [12, -50],
  [13, 15],
  [9, -80],
  [11, 25],
  [10, -35],
  [6, 10],
  [12, 20],
  [6, -60],
  [10, 35],
  [9, -15],
  [11, 75],
  [10, -25],
];

export const FALLEN_SHAPES_CONFIG = RAW_FALLEN.map((s, idx) => ({
  id: `fallen-${idx}`,
  src: ASSETS[s[0]],
  rot: s[1],
  dur: 5 + (idx % 3), // Durasi animasi acak antara 5, 6, atau 7 detik
}));
