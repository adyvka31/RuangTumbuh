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
  // Normalisasi input: huruf kecil dan hapus simbol non-alfanumerik
  const key = category?.toLowerCase().replace(/[^a-z0-9]/g, "") || "general";

  const mapping = {
    frontend: {
      color: "#38BDF8", // Biru Cerah
    },
    backend: {
      color: "#F472B6", // Merah Muda/Pink Cerah
    },
    uiuxdesign: {
      color: "#FACC15", // Kuning Cerah
    },
    mobiledev: {
      color: "#10B981", // Hijau Cerah
    },
    datascience: {
      color: "#A78BFA", // Ungu Cerah
    },
    matematika: {
      color: "#FB923C", // Oranye Cerah
    },
    bahasainggris: {
      color: "#6366F1", // Indigo
    },
    bahasaindonesia: {
      color: "#EF4444", // Merah Cerah
    },
    fisika: {
      color: "#14B8A6", // Teal Cerah
    },
  };

  return mapping[key] || { color: "#D1D5DB" };
};

export const MY_COURSE_TABS = [
  { id: "Kursus Saya", label: "Sesi Mentor Saya", icon: <FiUser /> },
  { id: "Permintaan", label: "Permintaan Masuk", icon: <FiBell /> },
  { id: "Pengajuan", label: "Pengajuan Saya", icon: <FiSend /> },
  { id: "Selesai", label: "Riwayat Selesai", icon: <FiCheckCircle /> },
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
