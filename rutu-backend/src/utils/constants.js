const BOOKING_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

const SCHEDULE_STATUS = {
  WAITING: "Menunggu Konfirmasi",
  PENDING: "Pending",
  CONFIRMED: "Terkonfirmasi",
  ONGOING: "Berlangsung",
  DONE: "Selesai",
};

const ROLE = {
  TUTOR: "TUTOR",
  STUDENT: "STUDENT",
};

const COURSE_CATEGORIES = [
  "Front-End",
  "Back-End",
  "UI/UX Designer",
  "Artificial Intelligence",
  "Mobile Development",
  "Data Science",
  "Matematika",
  "Fisika",
  "Kimia",
  "Biologi",
  "IPA Terpadu",
  "Ekonomi",
  "Geografi",
  "Sosiologi",
  "Sejarah",
  "IPS Terpadu",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Bahasa Arab",
  "Bahasa Jepang",
  "Bahasa Mandarin",
  "Pendidikan Agama",
  "PPKn",
  "Bisnis & Manajemen",
  "Akuntansi",
  "Seni & Desain",
];

module.exports = {
  BOOKING_STATUS,
  SCHEDULE_STATUS,
  ROLE,
  COURSE_CATEGORIES,
};
