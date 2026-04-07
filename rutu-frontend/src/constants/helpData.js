import {
  FiBook,
  FiCreditCard,
  FiSettings,
  FiAlertCircle,
} from "react-icons/fi";

export const helpCategories = [
  {
    id: 1,
    title: "Panduan Belajar",
    icon: <FiBook />,
    color: "#38BDF8",
    desc: "Cara memulai kursus dan menggunakan fitur kelas.",
  },
  {
    id: 2,
    title: "Pembayaran & Saldo",
    icon: <FiCreditCard />,
    color: "#FACC15",
    desc: "Masalah transaksi, invoice, dan penarikan saldo.",
  },
  {
    id: 3,
    title: "Akun & Keamanan",
    icon: <FiSettings />,
    color: "#A78BFA",
    desc: "Lupa password, verifikasi, dan pengaturan profil.",
  },
  {
    id: 4,
    title: "Kendala Teknis",
    icon: <FiAlertCircle />,
    color: "#F472B6",
    desc: "Bug aplikasi, error akses, dan masalah teknis lainnya.",
  },
];

export const faqs = [
  {
    id: 1,
    question: "Bagaimana cara mencairkan saldo pendapatan mentor?",
    answer:
      "Anda dapat mencairkan saldo melalui menu 'Dompet'. Minimal penarikan adalah Rp 100.000 dan proses memakan waktu 1-3 hari kerja ke rekening bank terdaftar.",
  },
  {
    id: 2,
    question:
      "Apakah saya bisa menjadwal ulang sesi mentoring yang sudah dibooking?",
    answer:
      "Ya, Anda bisa menjadwal ulang maksimal 1x24 jam sebelum sesi dimulai. Masuk ke menu 'Jadwal', pilih sesi terkait, dan klik tombol 'Jadwalkan Ulang'.",
  },
  {
    id: 3,
    question: "Apa yang terjadi jika saya lupa password akun saya?",
    answer:
      "Di halaman login, klik 'Lupa Password'. Kami akan mengirimkan tautan reset ke email yang terdaftar. Jika email tidak masuk, periksa folder spam Anda.",
  },
  {
    id: 4,
    question: "Sertifikat kelulusan kursus belum muncul, apa solusinya?",
    answer:
      "Pastikan Anda telah menonton seluruh video materi hingga selesai (progress 100%) dan telah lulus kuis akhir. Sertifikat biasanya ter-generate otomatis dalam 10 menit.",
  },
];
