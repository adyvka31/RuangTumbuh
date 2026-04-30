// rutu-frontend/src/constants/categoryConstants.js

export const COURSE_CATEGORIES = [
  // --- TEKNOLOGI & DIGITAL (Vocational / SMK) ---
  { value: "Front-End", label: "💻 Front-End" },
  { value: "Back-End", label: "⚙️ Back-End" },
  { value: "UI/UX Designer", label: "🎨 UI/UX Designer" },
  { value: "Mobile Development", label: "📱 Mobile Development" },
  { value: "Artificial Intelligence", label: "🤖 Artificial Intelligence" },
  { value: "Data Science", label: "📊 Data Science" },

  // --- SAINS & EKSAKTA (IPA) ---
  { value: "Matematika", label: "📐 Matematika" },
  { value: "Fisika", label: "⚛️ Fisika" },
  { value: "Kimia", label: "🧪 Kimia" },
  { value: "Biologi", label: "🧬 Biologi" },
  { value: "IPA Terpadu", label: "🔬 IPA Terpadu" },

  // --- SOSIAL & HUMANIORA (IPS) ---
  { value: "Ekonomi", label: "📈 Ekonomi" },
  { value: "Geografi", label: "🌍 Geografi" },
  { value: "Sosiologi", label: "🤝 Sosiologi" },
  { value: "Sejarah", label: "🏛️ Sejarah" },
  { value: "IPS Terpadu", label: "🗺️ IPS Terpadu" },

  // --- BAHASA & SASTRA ---
  { value: "Bahasa Indonesia", label: "🇮🇩 Bahasa Indonesia" },
  { value: "Bahasa Inggris", label: "🇬🇧 Bahasa Inggris" },
  { value: "Bahasa Arab", label: "🇸🇦 Bahasa Arab" },
  { value: "Bahasa Jepang", label: "🇯🇵 Bahasa Jepang" },
  { value: "Bahasa Mandarin", label: "🇨🇳 Bahasa Mandarin" },

  // --- UMUM & KEJURUAN ---
  { value: "Pendidikan Agama", label: "🕌 Pendidikan Agama" },
  { value: "PPKn", label: "🛡️ PPKn" },
  { value: "Bisnis & Manajemen", label: "💼 Bisnis & Manajemen" },
  { value: "Akuntansi", label: "🧮 Akuntansi" },
  { value: "Seni & Desain", label: "🎭 Seni & Desain" },
];

// Helper: Hanya mengambil list nama kategorinya saja (untuk Backend dan Filter Search Tab)
export const CATEGORY_VALUES = COURSE_CATEGORIES.map((cat) => cat.value);

// --- PETA WARNA KATEGORI (Hex Codes) ---
export const CATEGORY_COLORS = {
  // Teknologi
  "Front-End": "#38BDF8",
  "Back-End": "#1E293B",
  "UI/UX Designer": "#EC4899",
  "Mobile Development": "#8B5CF6",
  "Artificial Intelligence": "#6366F1",
  "Data Science": "#06B6D4",

  // Sains
  Matematika: "#FACC15",
  Fisika: "#EF4444",
  Kimia: "#10B981",
  Biologi: "#84CC16",
  "IPA Terpadu": "#14B8A6",

  // Sosial
  Ekonomi: "#F59E0B",
  Geografi: "#D97706",
  Sosiologi: "#F97316",
  Sejarah: "#9A3412",
  "IPS Terpadu": "#EA580C",

  // Bahasa
  "Bahasa Indonesia": "#EF4444",
  "Bahasa Inggris": "#3B82F6",
  "Bahasa Arab": "#10B981",
  "Bahasa Jepang": "#F43F5E",
  "Bahasa Mandarin": "#E11D48",

  // Umum & Kejuruan
  "Pendidikan Agama": "#059669",
  PPKn: "#B91C1C",
  "Bisnis & Manajemen": "#475569",
  Akuntansi: "#64748B",
  "Seni & Desain": "#D946EF",

  // Fallback
  Default: "#94A3B8",
};
