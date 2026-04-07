import { FiUser, FiBell, FiSend, FiCheckCircle } from "react-icons/fi";

export const COURSE_CATEGORIES = [
  "Semua",
  "Frontend",
  "Backend",
  "UI/UX Design",
  "Mobile Dev",
  "Data Science",
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fisika",
];

export const getCourseExtras = (category) => {
  const mapping = {
    Frontend: {
      color: "#38BDF8",
      emoji: "👩‍💻",
      image:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600",
    },
    Backend: {
      color: "#F472B6",
      emoji: "⚙️",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600",
    },
    "UI/UX Design": {
      color: "#FACC15",
      emoji: "🎨",
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&q=80&w=600",
    },
    "Mobile Dev": {
      color: "#10B981",
      emoji: "📱",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600",
    },
    "Data Science": {
      color: "#A78BFA",
      emoji: "📊",
      image:
        "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=600",
    },
    Matematika: {
      color: "#FB923C",
      emoji: "📐",
      image:
        "https://images.unsplash.com/photo-1509228468518-180dd482270b?auto=format&fit=crop&q=80&w=600",
    },
    "Bahasa Inggris": {
      color: "#6366F1",
      emoji: "🇬🇧",
      image:
        "https://images.unsplash.com/photo-1543165796-5426273eaab3?auto=format&fit=crop&q=80&w=600",
    },
    "Bahasa Indonesia": {
      color: "#EF4444",
      emoji: "🇮🇩",
      image:
        "https://images.unsplash.com/photo-1518173946687-a4c8a9b746f4?auto=format&fit=crop&q=80&w=600",
    },
    Fisika: {
      color: "#14B8A6",
      emoji: "⚛️",
      image:
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600",
    },
  };
  return mapping[category] || { color: "#D1D5DB", emoji: "📚" }; // Default fallback
};

export const MY_COURSE_TABS = [
  { id: "Kursus Saya", label: "Sesi Mentor Saya", icon: FiUser },
  { id: "Permintaan", label: "Permintaan Masuk", icon: FiBell },
  { id: "Pengajuan", label: "Pengajuan Saya", icon: FiSend },
  { id: "Selesai", label: "Riwayat Selesai", icon: FiCheckCircle },
];

export const COMPLETED_COURSES_DUMMY = [
  {
    id: 201,
    name: "Amanda Smith",
    role: "Mentor",
    topic: "Figma Prototyping Lanjutan",
    date: "20 Okt 2026",
    time: "Selesai",
    emoji: "👱‍♀️",
    color: "#10B981",
    rating: 5,
    review: "Sangat membantu!",
  },
];
