import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
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

// Konfigurasi Pilihan Kategori
const CATEGORY_OPTIONS = [
  { value: "Front-End", label: "💻 Front-End Web" },
  { value: "Back-End", label: "⚙️ Back-End Web" },
  { value: "UI/UX Designer", label: "🎨 UI/UX Designer" },
  { value: "Matematika", label: "📐 Matematika" },
  { value: "Fisika", label: "⚛️ Fisika" },
  { value: "Bahasa Inggris", label: "🇬🇧 Bahasa Inggris" },
  { value: "Bisnis & Manajemen", label: "📊 Bisnis & Manajemen" },
];

export default function AddCoursePage() {
  const {
    formData,
    modules,
    errors,
    popup,
    mutation,
    isEditMode,
    isFetching, // Ambil isEditMode dan isFetching
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

  if (isFetching) {
    return (
      <DashboardLayout title="Memuat Kursus...">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "100px",
            fontSize: "1.5rem",
            fontWeight: "800",
          }}
        >
          Mengambil data kursus... ⏳
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={isEditMode ? "Edit Kursus" : "Tambah Kursus Baru"}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          {/* Ubah title header */}
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
                  errorMessage={errors.title} // Memicu border merah jika kosong
                />
              </div>

              <div className={styles.rowGroup}>
                <div className={styles.inputGroup}>
                  <Input
                    isSelect // Mengubah input menjadi Dropdown
                    label="Kategori"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={CATEGORY_OPTIONS}
                    errorMessage={errors.category} // Memicu border merah jika kosong
                  />
                </div>
                <div className={styles.inputGroup}>
                  <Input
                    label="Durasi (Menit)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    errorMessage={errors.duration} // Memicu border merah jika kosong
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
                  errorMessage={errors.description} // Memicu border merah jika kosong
                />
              </div>

              {/* UPLOAD AREA */}
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

              {/* Pesan error khusus jika modul kosong/tidak valid */}
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
                      }} // Efek merah jika error
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
              {/* Ubah teks konfirmasi */}
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
              {/* Ubah teks tombol utama */}
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
          onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
        />
      </div>
    </DashboardLayout>
  );
}
