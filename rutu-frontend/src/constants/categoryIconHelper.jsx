import React from "react";
import {
  FiCpu, // [TAMBAHAN] Ikon CPU untuk AI
  FiMonitor,
  FiServer,
  FiLayout,
  FiSmartphone,
  FiBarChart2,
  FiPenTool,
  FiTarget,
  FiFeather,
  FiWind,
  FiSearch,
  FiTrendingUp,
  FiGlobe,
  FiUsers,
  FiBookOpen,
  FiMap,
  FiMessageCircle,
  FiStar,
  FiShield,
  FiBriefcase,
  FiPieChart,
  FiEdit3,
  FiFolder,
} from "react-icons/fi";

export const getCategoryIcon = (category, size = 48) => {
  const iconProps = { size, color: "white" };

  switch (category) {
    // Teknologi
    case "Artificial Intelligence":
      return <FiCpu {...iconProps} />; // [TAMBAHAN]
    case "Front-End Web":
      return <FiMonitor {...iconProps} />;
    case "Back-End Web":
      return <FiServer {...iconProps} />;
    case "UI/UX Designer":
      return <FiLayout {...iconProps} />;
    case "Mobile Development":
      return <FiSmartphone {...iconProps} />;
    case "Data Science":
      return <FiBarChart2 {...iconProps} />;

    // Sains
    case "Matematika":
      return <FiPenTool {...iconProps} />;
    case "Fisika":
      return <FiTarget {...iconProps} />;
    case "Kimia":
      return <FiFeather {...iconProps} />;
    case "Biologi":
      return <FiWind {...iconProps} />;
    case "IPA Terpadu":
      return <FiSearch {...iconProps} />;

    // Sosial
    case "Ekonomi":
      return <FiTrendingUp {...iconProps} />;
    case "Geografi":
      return <FiGlobe {...iconProps} />;
    case "Sosiologi":
      return <FiUsers {...iconProps} />;
    case "Sejarah":
      return <FiBookOpen {...iconProps} />;
    case "IPS Terpadu":
      return <FiMap {...iconProps} />;

    // Bahasa
    case "Bahasa Indonesia":
    case "Bahasa Inggris":
    case "Bahasa Arab":
    case "Bahasa Jepang":
    case "Bahasa Mandarin":
      return <FiMessageCircle {...iconProps} />;

    // Umum
    case "Pendidikan Agama":
      return <FiStar {...iconProps} />;
    case "PPKn":
      return <FiShield {...iconProps} />;
    case "Bisnis & Manajemen":
      return <FiBriefcase {...iconProps} />;
    case "Akuntansi":
      return <FiPieChart {...iconProps} />;
    case "Seni & Desain":
      return <FiEdit3 {...iconProps} />;

    default:
      return <FiFolder {...iconProps} />;
  }
};
