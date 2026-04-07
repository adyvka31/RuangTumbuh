import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { Popup } from "@/components/Popup/Popup";
import { Input } from "@/components/Input/Input";
import { FiPlus, FiTrash2, FiSave, FiCheckCircle } from "react-icons/fi";
import styles from "./AddCoursePage.module.css";
import { useAddCourse } from "@/hooks/useAddCourse";

export default function AddCoursePage() {
  const {
    formData,
    modules,
    error,
    popup,
    mutation,
    setPopup,
    handleInputChange,
    addModule,
    removeModule,
    updateModule,
    handleSubmit,
  } = useAddCourse();

  return (
    <DashboardLayout title="Tambah Kursus Baru">
      <form onSubmit={handleSubmit} className={styles.container}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Input
          name="title"
          label="Judul"
          value={formData.title}
          onChange={handleInputChange}
        />
        <Input
          name="duration"
          type="number"
          label="Durasi"
          value={formData.duration}
          onChange={handleInputChange}
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />

        <div>
          {modules.map((m) => (
            <div key={m.id}>
              <Input
                value={m.title}
                onChange={(e) => updateModule(m.id, "title", e.target.value)}
              />
              <Input
                type="number"
                value={m.duration}
                onChange={(e) => updateModule(m.id, "duration", e.target.value)}
              />
              <button type="button" onClick={() => removeModule(m.id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addModule}>
          <FiPlus /> Tambah Modul
        </button>

        <button type="submit" disabled={mutation.isPending}>
          <FiSave /> {mutation.isPending ? "Loading..." : "Simpan"}
        </button>
      </form>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={<FiCheckCircle />}
        title={popup.title}
        description={popup.description}
        onAction={() => setPopup((p) => ({ ...p, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
