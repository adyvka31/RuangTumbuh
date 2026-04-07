const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";

export const getImageUrl = (path) => {
  if (!path) return "/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};
