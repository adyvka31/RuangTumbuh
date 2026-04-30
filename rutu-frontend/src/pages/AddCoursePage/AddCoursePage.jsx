import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
  FiLayers,
  FiUploadCloud,
  FiArrowLeft,
} from "react-icons/fi";
import styles from "./AddCoursePage.module.css";
import { useAddCourse } from "@/hooks/useAddCourse";

// [PENTING]: Import struktur Kategori Baku dari file constants
import { COURSE_CATEGORIES } from "@/constants/categoryConstants";

export default function AddCoursePage() {
  const {
    formData,
    modules,
    errors,
    popup,
    mutation,
    isEditMode,
    isFetching,
    setPopup,
    handleInputChange,
    addModule,
    removeModule,
    updateModule,
    handleSubmit,
    handleGoBack,
  } = useAddCourse();

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } },
    exit: { opacity: 0, scale: 0.9, height: 0, padding: 0, overflow: "hidden" },
  };

  // =========================================
  // VIEW LOADING SKELETON
  // =========================================
  if (isFetching) {
    return (
      <DashboardLayout title="Memuat Halaman...">
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <Skeleton width="220px" height="40px" />
            <Skeleton
              width="110px"
              height="45px"
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className={styles.splitLayout}>
            {/* SKELETON KOLOM KIRI (Info Dasar) */}
            <div
              className={styles.mainCard}
              style={{
                backgroundColor: "#f8fafc",
                border: "2px solid #e2e8f0",
              }}
            >
              <div className={styles.cardHeader}>
                <Skeleton variant="circle" width="40px" height="40px" />
                <Skeleton
                  width="150px"
                  height="24px"
                  style={{ marginLeft: "15px" }}
                />
              </div>
              <div style={{ marginTop: "20px" }}>
                <Skeleton
                  width="100%"
                  height="55px"
                  style={{ marginBottom: "20px", borderRadius: "12px" }}
                />
                <div className={styles.rowGroup}>
                  <Skeleton
                    width="100%"
                    height="55px"
                    style={{ borderRadius: "12px" }}
                  />
                  <Skeleton
                    width="100%"
                    height="55px"
                    style={{ borderRadius: "12px" }}
                  />
                </div>
                <Skeleton
                  width="100%"
                  height="120px"
                  style={{ marginTop: "20px", borderRadius: "12px" }}
                />
                <Skeleton
                  width="100%"
                  height="150px"
                  style={{ marginTop: "20px", borderRadius: "20px" }}
                />
              </div>
            </div>

            {/* SKELETON KOLOM KANAN (Modul) */}
            <div
              className={styles.modulesCard}
              style={{
                backgroundColor: "#f8fafc",
                border: "2px solid #e2e8f0",
              }}
            >
              <div className={styles.cardHeader}>
                <Skeleton variant="circle" width="40px" height="40px" />
                <Skeleton
                  width="150px"
                  height="24px"
                  style={{ marginLeft: "15px" }}
                />
              </div>
              <Skeleton
                width="100%"
                height="16px"
                style={{ marginTop: "15px", marginBottom: "25px" }}
              />
              <div className={styles.moduleList}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={styles.moduleItem}
                    style={{
                      backgroundColor: "#fff",
                      border: "2px solid #eee",
                    }}
                  >
                    <Skeleton
                      variant="circle"
                      width="30px"
                      height="30px"
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, display: "flex", gap: "10px" }}>
                      <Skeleton width="100%" height="50px" />
                      <Skeleton width="60px" height="50px" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton
                width="100%"
                height="50px"
                style={{ marginTop: "20px", borderRadius: "12px" }}
              />
            </div>
          </div>

          <div className={styles.actionBar}>
            <div className={styles.actionText}>
              <Skeleton
                width="180px"
                height="24px"
                style={{ marginBottom: "8px" }}
              />
              <Skeleton width="250px" height="16px" />
            </div>
            <Skeleton
              width="220px"
              height="55px"
              style={{ borderRadius: "12px" }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================
  // VIEW UTAMA
  // =========================================
  return (
    <DashboardLayout title={isEditMode ? "Edit Kursus" : "Tambah Kursus Baru"}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {isEditMode ? "Edit Kursus" : "Buat Kursus Baru"}
          </h1>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleGoBack}
          >
            <FiArrowLeft /> Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.splitLayout}>
            {/* KOLOM KIRI */}
            <div className={styles.mainCard}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.headerIconWrap}
                  style={{ backgroundColor: "#FACC15" }}
                >
                  <FiBookOpen />
                </div>
                <h3>Informasi Dasar</h3>
              </div>

              <div className={styles.inputGroup}>
                <Input
                  label="Judul Kursus"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  errorMessage={errors.title}
                />
              </div>

              <div className={styles.rowGroup}>
                <div className={styles.inputGroup}>
                  <Input
                    isSelect
                    label="Kategori"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={COURSE_CATEGORIES} // DATA CONSTANT DIGUNAKAN DI SINI
                    errorMessage={errors.category}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <Input
                    label="Durasi (Menit)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    errorMessage={errors.duration}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <Input
                  isTextarea
                  label="Deskripsi Singkat"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  errorMessage={errors.description}
                />
              </div>

              <div className={styles.uploadContainer}>
                <label className={styles.uploadLabel}>Thumbnail Kursus</label>
                <div className={styles.uploadArea}>
                  <FiUploadCloud className={styles.uploadIcon} />
                  <div className={styles.uploadText}>
                    <h4>Klik atau drag foto ke sini</h4>
                    <p>SVG, PNG, JPG atau GIF (Max. 800x400px)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN */}
            <div className={styles.modulesCard}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.headerIconWrap}
                  style={{ backgroundColor: "#38BDF8" }}
                >
                  <FiLayers />
                </div>
                <h3>Kurikulum Modul</h3>
              </div>

              <p className={styles.moduleDesc}>
                Tambahkan materi-materi yang akan diajarkan secara berurutan.
              </p>

              {errors.modules && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "0.85rem",
                    fontWeight: "800",
                  }}
                >
                  {errors.modules}
                </div>
              )}

              <div className={styles.moduleList}>
                <AnimatePresence>
                  {modules.map((m, index) => (
                    <motion.div
                      key={m.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className={styles.moduleItem}
                      style={{
                        borderColor: errors.modules ? "#ef4444" : "#000",
                      }}
                    >
                      <div className={styles.moduleNumber}>{index + 1}</div>

                      <div className={styles.moduleInputs}>
                        <Input
                          label="Judul Materi"
                          value={m.title}
                          onChange={(e) =>
                            updateModule(m.id, "title", e.target.value)
                          }
                        />
                        <Input
                          label="Menit"
                          type="number"
                          value={m.duration}
                          onChange={(e) =>
                            updateModule(m.id, "duration", e.target.value)
                          }
                        />
                      </div>

                      <button
                        type="button"
                        className={styles.trashBtn}
                        onClick={() => removeModule(m.id)}
                        disabled={modules.length === 1}
                      >
                        <FiTrash2 />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                type="button"
                className={styles.addModuleBtn}
                onClick={addModule}
              >
                <FiPlus size={22} /> Tambah Modul Baru
              </button>
            </div>
          </div>

          <div className={styles.actionBar}>
            <div className={styles.actionText}>
              <h3>
                {isEditMode ? "Simpan Perubahan?" : "Siap untuk dipublikasi?"}
              </h3>
              <p>Pastikan semua data dan modul sudah terisi dengan benar.</p>
            </div>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Menyimpan..."
                : isEditMode
                  ? "Perbarui Kursus Sekarang"
                  : "Simpan Kursus Sekarang"}
              {!mutation.isPending && <FiSave size={20} />}
            </button>
          </div>
        </form>

        <Popup
          isOpen={popup.isOpen}
          type={popup.type}
          icon={popup.type === "error" ? <FiAlertCircle /> : <FiCheckCircle />}
          title={popup.title}
          description={popup.description}
          buttonText="Tutup"
          onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
        />
      </div>
    </DashboardLayout>
  );
}
