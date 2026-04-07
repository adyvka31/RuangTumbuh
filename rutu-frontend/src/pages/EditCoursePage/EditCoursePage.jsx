import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "../AddCoursePage/AddCoursePage.module.css";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
import inputStyles from "@/components/Input/Input.module.css";
import { useEditCourse } from "@/hooks/useEditCourse";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiClock,
  FiBookOpen,
  FiList,
  FiVideo,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function EditCoursePage() {
  const {
    formData,
    modules,
    setModules,
    popup,
    setPopup,
    isLoading,
    isPending,
    handleInputChange,
    updateModule,
    handleSave,
  } = useEditCourse();

  if (isLoading)
    return (
      <DashboardLayout title="Edit Kursus">
        <div className={styles.loading}>Memuat data...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Edit Kursus">
      <form onSubmit={handleSave} className={styles.container}>
        <div className={styles.splitLayout}>
          {/* INFORMASI UTAMA */}
          <div className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#38BDF8" }}
              >
                <FiBookOpen />
              </div>
              <h3>Edit Informasi Utama</h3>
            </div>
            <Input
              name="title"
              label="Judul Kursus"
              value={formData.title}
              onChange={handleInputChange}
            />
            <div className={styles.rowGroup}>
              <div className={inputStyles.inputContainer}>
                <div className={inputStyles.inputWrapper}>
                  <select
                    name="category"
                    className={inputStyles.inputForm}
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="programming">Pemrograman</option>
                    <option value="design">UI/UX Design</option>
                    <option value="business">Bisnis & Marketing</option>
                  </select>
                  <label
                    className={inputStyles.floatingLabel}
                    style={{
                      color: formData.category
                        ? "var(--primary-yellow)"
                        : "#b0b7c3",
                    }}
                  >
                    Kategori
                  </label>
                  <FiChevronDown className={inputStyles.inputIcon} />
                </div>
              </div>
              <Input
                name="duration"
                label="Durasi (Menit)"
                type="number"
                icon={FiClock}
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>
            <Input
              name="description"
              label="Deskripsi"
              isTextarea
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* DAFTAR MODUL */}
          <div className={styles.modulesCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.headerIconWrap}
                style={{ backgroundColor: "#FACC15" }}
              >
                <FiList />
              </div>
              <h3>Daftar Modul</h3>
            </div>
            <div className={styles.moduleList}>
              <AnimatePresence>
                {modules.map((module, idx) => (
                  <motion.div
                    key={module.id}
                    className={styles.moduleItem}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.moduleNumber}>{idx + 1}</div>
                    <div className={styles.moduleInputs}>
                      <Input
                        label="Judul Materi"
                        value={module.title}
                        onChange={(e) =>
                          updateModule(module.id, "title", e.target.value)
                        }
                      />
                      <Input
                        label="Menit"
                        type="number"
                        icon={FiVideo}
                        value={module.duration}
                        onChange={(e) =>
                          updateModule(module.id, "duration", e.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.trashBtn}
                      onClick={() =>
                        setModules(modules.filter((m) => m.id !== module.id))
                      }
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
              onClick={() =>
                setModules([
                  ...modules,
                  { id: Date.now(), title: "", duration: "" },
                ])
              }
            >
              <FiPlus /> Tambah Modul
            </button>
          </div>
        </div>

        <div className={styles.actionBar}>
          <button type="submit" className={styles.saveBtn} disabled={isPending}>
            <FiSave /> {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
