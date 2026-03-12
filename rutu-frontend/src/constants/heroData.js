import textLogo from "@assets/text-logo.svg";
import shape1 from "@assets/shape1.svg";
import shape2 from "@assets/shape2.svg";
import shape3 from "@assets/shape3.svg";
import shape4 from "@assets/shape4.svg";
import shape5 from "@assets/shape5.svg";
import shape6 from "@assets/shape6.svg";
import shape7 from "@assets/shape7.svg";
import shape8 from "@assets/shape8.svg";
import shape9 from "@assets/shape9.svg";
import shape10 from "@assets/shape10.svg";
import shape11 from "@assets/shape11.svg";
import shape12 from "@assets/shape12.svg";
import shape13 from "@assets/shape13.svg";

export const TEXT_LOGO = textLogo;

const ASSETS = [
  null,
  shape1,
  shape2,
  shape3,
  shape4,
  shape5,
  shape6,
  shape7,
  shape8,
  shape9,
  shape10,
  shape11,
  shape12,
  shape13,
];

const RAW_SHAPES = [
  [1, "upFast", "leftSlow", -15, 0, 5],
  [2, "upSlow", "rightFast", 25, 0, 6.5],
  [3, "downSlow", "leftFast", -40, 0, 7],
  [4, "downFast", "rightSlow", 10, 0, 5.5],
  [5, "upSlow", "leftFast", -10, 1, 6],
  [6, "downSlow", "rightFast", 45, 1, 7.5],
  [7, "upFast", "rightSlow", -20, 1, 5.8],
  [8, "downFast", "leftSlow", 10, 1, 5.2],
  [9, "upFast", "leftFast", 30, 1, 6.8],
  [10, "downFast", "rightFast", -30, 1, 7.2],
  [1, "upSlow", "rightSlow", 80, 0, 5.8],
  [2, "downFast", "leftFast", -80, 1, 6.1],
  [4, "upFast", "leftSlow", 110, 0, 7.4],
  [5, "downSlow", "rightFast", -15, 1, 5.3],
  [7, "downFast", "rightSlow", 60, 0, 6.9],
  [8, "upSlow", "leftFast", -120, 1, 5.7],
  [3, "upFast", "rightFast", 15, 1, 7.1],
  [6, "downSlow", "leftSlow", 90, 0, 6.2],
  [3, "upFast", "leftFast", 45, 0, 5.9],
  [4, "downSlow", "rightFast", -25, 1, 7.3],
  [5, "upSlow", "rightSlow", 135, 0, 6.4],
  [6, "downFast", "leftSlow", -15, 0, 5.1],
  [7, "upFast", "rightFast", 75, 1, 6.7],
  [8, "downFast", "rightSlow", -90, 0, 7.8],
  [1, "upSlow", "leftSlow", 180, 1, 5.6],
  [2, "downSlow", "leftFast", 50, 0, 6.3],
  [5, "upFast", "leftSlow", 200, 1, 7.6],
  [3, "downFast", "rightFast", -110, 0, 5.4],
  [6, "upSlow", "rightFast", 65, 1, 6.6],
  [4, "downSlow", "leftSlow", -140, 0, 7.7],
  [9, "upFast", "rightSlow", 45, 1, 5.5],
  [10, "downFast", "leftFast", -45, 1, 6.2],
  [7, "upSlow", "leftSlow", 90, 0, 7.1],
  [8, "downSlow", "rightSlow", -90, 0, 5.8],
  [2, "upFast", "leftFast", 15, 1, 6.9],
  [1, "downFast", "rightFast", -15, 1, 5.3],
  [5, "upSlow", "rightSlow", 120, 0, 7.5],
  [6, "downSlow", "leftSlow", -120, 0, 6.4],
  [3, "upFast", "rightFast", 75, 1, 5.7],
  [4, "downFast", "leftFast", -75, 1, 6.8],
];

export const SHAPES_CONFIG = RAW_SHAPES.map((s, idx) => ({
  id: idx + 1,
  src: ASSETS[s[0]],
  moveY: s[1],
  moveX: s[2],
  rot: s[3],
  z: s[4] ? "shapeFront" : "shapeBack",
  cName: `s${idx + 1}`,
  dur: s[5],
}));
