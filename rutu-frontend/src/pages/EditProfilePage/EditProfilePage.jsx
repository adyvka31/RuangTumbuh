import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./EditProfilePage.module.css";
import { Input } from "@/components/Input/Input";
import { Popup } from "@/components/Popup/Popup";
import { useEditProfile } from "@/hooks/useEditProfile";
import { getImageUrl } from "@/utils/imageHelper";
import {
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
  FiCheckCircle,
} from "react-icons/fi";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const {
    formData,
    newPassion,
    setNewPassion,
    error,
    popup,
    previewImage,
    fileInputRef,
    isLoading,
    isPending,
    handleInputChange,
    addPassion,
    removePassion,
    handleFileChange,
    handleSave,
  } = useEditProfile();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading)
    return (
      <DashboardLayout title="Pengaturan Profil">
        <p className={styles.loading}>Memuat formulir...</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Pengaturan Profil">
      <motion.div className={styles.container} initial="hidden" animate="show">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Profil Saya</h1>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/profile")}
          >
            <FiArrowLeft /> Kembali
          </button>
        </div>

        <div className={styles.contentGrid}>
          <motion.div variants={itemVariants} className={styles.mainCard}>
            <div className={styles.avatarUploadSection}>
              <div className={styles.avatarPreview}>
                {previewImage ? (
                  <img src={getImageUrl(previewImage)} alt="Preview" />
                ) : formData.avatar && formData.avatar.length > 2 ? (
                  <img src={getImageUrl(formData.avatar)} alt="Profile" />
                ) : (
                  <div className={styles.initialsAvatar}>{formData.avatar}</div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current.click()}
              >
                <FiUploadCloud /> Unggah Foto
              </button>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.formGrid}>
              <Input
                name="name"
                label="Nama Lengkap"
                icon={FiType}
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                label="Email"
                icon={FiMail}
                value={formData.email}
                readOnly
              />
              <Input
                name="location"
                label="Lokasi"
                icon={FiMapPin}
                value={formData.location}
                onChange={handleInputChange}
              />
              <Input
                name="birthday"
                label="Tanggal Lahir"
                type="date"
                icon={FiGift}
                value={formData.birthday}
                onChange={handleInputChange}
              />
              <Input
                name="school"
                label="Institusi"
                icon={FiBookOpen}
                value={formData.school}
                onChange={handleInputChange}
              />
              <Input
                name="description"
                label="Bio"
                isTextarea
                icon={FiUser}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.sidebarCard}>
            <div className={styles.sectionHeader}>
              <FiStar className={styles.cardIcon} />{" "}
              <h3 className={styles.sectionTitle}>Passion</h3>
            </div>
            <div className={styles.passionInputWrapper}>
              <Input
                value={newPassion}
                onChange={(e) => setNewPassion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPassion()}
              />
              <button className={styles.addPassionBtn} onClick={addPassion}>
                <FiPlus />
              </button>
            </div>
            <div className={styles.passionWrapper}>
              {formData.passions.map((p, i) => (
                <span key={i} className={styles.passionTag}>
                  {p} <FiX onClick={() => removePassion(p)} />
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className={styles.actionBar}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </motion.div>

      <Popup
        isOpen={popup.isOpen}
        icon={<FiCheckCircle />}
        title={popup.title}
        description={popup.description}
        onAction={() => navigate("/profile")}
      />
    </DashboardLayout>
  );
}
