import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./EditProfilePage.module.css";
import { Input } from "@/components/Input/Input";
import { Popup } from "@/components/Popup/Popup"; // Pastikan di-import untuk notifikasi sukses
import {
  FiSave,
  FiX,
  FiUploadCloud,
  FiUser,
  FiMail,
  FiMapPin,
  FiGift,
  FiBookOpen,
  FiStar,
  FiArrowLeft,
  FiType,
  FiPlus,
  FiCheckCircle, // Icon untuk popup sukses
} from "react-icons/fi";

export default function EditProfilePage() {
  const navigate = useNavigate();

  // State Utama
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // State untuk Upload Foto
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    birthday: "",
    school: "",
    description: "",
    passions: [],
    avatar: "",
  });

  const [newPassion, setNewPassion] = useState("");
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  // 1. MENGAMBIL DATA DARI BACKEND SAAT HALAMAN DIMUAT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!localUser.id) {
          navigate("/login");
          return;
        }
        setUserId(localUser.id);

        const response = await fetch(
          `http://localhost:5001/api/users/${localUser.id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || "",
            email: data.email || "",
            location: data.location || "",
            birthday: data.birthday || "",
            school: data.school || "",
            description: data.description || "",
            passions: data.passions || [],
            avatar:
              data.profilePicture ||
              (data.name ? data.name.substring(0, 2).toUpperCase() : "US"),
          });
        }
      } catch (error) {
        console.error("Gagal load profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fungsi Form & Tags
  const handleInputChange = (e) => {
    if (error) setError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addPassion = () => {
    if (newPassion && !formData.passions.includes(newPassion)) {
      // VALIDASI: Maksimal 10 Passion
      if (formData.passions.length >= 10) {
        setError("Maksimal hanya boleh menambahkan 10 keahlian/passion.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        passions: [...prev.passions, newPassion],
      }));
      setNewPassion("");
      setError("");
    }
  };

  const removePassion = (passionToRemove) => {
    setFormData((prev) => ({
      ...prev,
      passions: prev.passions.filter((p) => p !== passionToRemove),
    }));
  };

  // Fungsi Upload File Visual
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // VALIDASI: Ukuran Maksimal 2MB
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran foto terlalu besar! Maksimal 2MB.");
        return;
      }
      // VALIDASI: Harus berupa file gambar
      if (!file.type.startsWith("image/")) {
        setError("Format file tidak didukung. Harap unggah gambar (JPG/PNG).");
        return;
      }

      setError("");
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 2. MENGIRIM DATA KE BACKEND SAAT TOMBOL SIMPAN DIKLIK
  const handleSave = async () => {
    if (!userId) return;
    setError(""); // Reset error sebelumnya

    const { name, location, birthday, school, description } = formData;

    // 1. Validasi Nama
    if (name) {
      const nameRegex = /^[a-zA-Z\s]*$/;
      const nameWords = name.trim().split(/\s+/);
      if (
        !nameRegex.test(name) ||
        nameWords.length < 2 ||
        nameWords.length > 5
      ) {
        setError(
          "Nama lengkap harus terdiri dari 2-5 kata dan hanya berisi huruf.",
        );
        return;
      }
    }

    // 2. Validasi Tanggal Lahir (Masa Depan)
    if (birthday) {
      const selectedDate = new Date(birthday);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset jam agar adil
      if (selectedDate > today) {
        setError(
          "Hmm, sepertinya Anda belum lahir di tanggal tersebut. Mohon pilih tanggal yang valid.",
        );
        return;
      }
    }

    // 3. Validasi Panjang Karakter (Bio, Lokasi, Sekolah)
    if (description && description.length > 500) {
      setError(
        `Deskripsi terlalu panjang! Saat ini: ${description.length}/500 karakter.`,
      );
      return;
    }
    if (location && location.length > 100) {
      setError("Lokasi terlalu panjang (Maksimal 100 karakter).");
      return;
    }
    if (school && school.length > 100) {
      setError(
        "Nama institusi/sekolah terlalu panjang (Maksimal 100 karakter).",
      );
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("birthday", formData.birthday);
      formDataToSend.append("school", formData.school);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("passions", JSON.stringify(formData.passions));

      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      const response = await fetch(
        `http://localhost:5001/api/users/${userId}`,
        {
          method: "PUT",
          body: formDataToSend,
        },
      );

      const result = await response.json();

      if (response.ok) {
        // Update data 'name' di localStorage agar Topbar & Sidebar ikut berubah
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        localUser.name = formData.name;
        localStorage.setItem("user", JSON.stringify(localUser));

        setPopup({
          isOpen: true,
          type: "success",
          title: "Profil Diperbarui!",
          description: "Data diri Anda berhasil disimpan.",
        });
      } else {
        setError(result.message || "Gagal memperbarui profil.");
      }
    } catch (error) {
      console.error("Error save profile:", error);
      setError("Terjadi kesalahan koneksi ke server backend.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (loading) {
    return (
      <DashboardLayout title="Pengaturan Profil">
        <p style={{ padding: "20px" }}>Memuat data profil Anda...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Pengaturan Profil">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Profil Saya</h1>
          <motion.button
            whileHover={{ x: -4 }}
            className={styles.backBtn}
            onClick={() => navigate("/profile")}
          >
            <FiArrowLeft /> Kembali ke Profil
          </motion.button>
        </div>

        <div className={styles.contentGrid}>
          {/* KOLOM KIRI: Main Form */}
          <motion.div variants={itemVariants} className={styles.mainCard}>
            <div className={styles.avatarUploadSection}>
              <div
                className={styles.avatarPreview}
                style={{ overflow: "hidden" }}
              >
                {previewImage ? (
                  // Menampilkan preview jika user baru saja memilih gambar baru
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : formData.avatar &&
                  formData.avatar.startsWith("/uploads") ? (
                  <img
                    src={`http://localhost:5001${formData.avatar}`}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  formData.avatar
                )}
              </div>
              <div className={styles.uploadActions}>
                <p className={styles.uploadStatus}>
                  Format: JPG, PNG. Maks 2MB.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                />
                <motion.button
                  className={styles.uploadBtn}
                  onClick={triggerFileInput}
                >
                  <FiUploadCloud /> Unggah Foto Baru
                </motion.button>
              </div>
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  marginTop: "-15px",
                }}
              >
                {error}
              </p>
            )}

            <div className={styles.formGrid}>
              <div className={styles.fullWidth}>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  label="Nama Lengkap"
                  icon={FiType}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  label="Alamat Email"
                  icon={FiMail}
                  value={formData.email}
                  readOnly
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  label="Lokasi Saat Ini"
                  icon={FiMapPin}
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  type="date"
                  name="birthday"
                  id="birthday"
                  label="Tanggal Lahir"
                  icon={FiGift}
                  value={formData.birthday}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.fullWidth}>
                <Input
                  type="text"
                  name="school"
                  id="school"
                  label="Institusi / Sekolah"
                  icon={FiBookOpen}
                  value={formData.school}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.fullWidth}>
                <Input
                  isTextarea={true}
                  name="description"
                  id="description"
                  label="Deskripsi Diri (Bio)"
                  icon={FiUser}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </motion.div>

          {/* KOLOM KANAN: Sidebar (Passion) */}
          <motion.div variants={itemVariants} className={styles.sidebarCard}>
            <div className={styles.sectionHeader}>
              <FiStar
                className={styles.cardIcon}
                style={{ color: "#facc15" }}
              />
              <h3 className={styles.sectionTitle}>Passion & Keahlian</h3>
            </div>

            <div style={{ marginTop: "20px" }}>
              <div className={styles.passionInputWrapper}>
                <div style={{ flex: 1 }}>
                  <Input
                    type="text"
                    name="newPassion"
                    id="newPassion"
                    label="Tambah keahlian..."
                    value={newPassion}
                    onChange={(e) => setNewPassion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPassion()}
                  />
                </div>
                <motion.button
                  whileHover={{ y: -3, boxShadow: "4px 4px 0px #000" }}
                  whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
                  className={styles.addPassionBtn}
                  onClick={addPassion}
                >
                  <FiPlus />
                </motion.button>
              </div>

              <div className={styles.passionWrapper}>
                {formData.passions.map((passion, index) => (
                  <span key={index} className={styles.passionTag}>
                    {passion}
                    <span
                      className={styles.removeTag}
                      onClick={() => removePassion(passion)}
                    >
                      <FiX />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM ACTIONS */}
        <motion.div
          className={styles.actionBar}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.actionText}>
            <h3>Sudah selesai? 🚀</h3>
            <p>
              Pastikan semua data sudah terisi dengan benar sebelum menyimpan.
            </p>
          </div>

          <div className={styles.actionButtons}>
            <motion.button
              whileHover={{
                y: -3,
                boxShadow: "6px 6px 0px #000",
                backgroundColor: "#f9fafb",
              }}
              whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
              className={styles.cancelBtn}
              onClick={() => navigate("/profile")}
            >
              <FiX size={20} /> Batal
            </motion.button>
            <motion.button
              whileHover={{ y: -4, boxShadow: "8px 8px 0px #000" }}
              whileTap={{ y: 2, boxShadow: "0px 0px 0px #000" }}
              className={styles.saveBtn}
              onClick={handleSave}
            >
              <FiSave size={20} /> Simpan Perubahan
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* POPUP SUKSES */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={<FiCheckCircle />}
        title={popup.title}
        description={popup.description}
        buttonText="Oke"
        onAction={() => {
          setPopup({ ...popup, isOpen: false });
          navigate("/profile");
        }}
      />
    </DashboardLayout>
  );
}
