import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { Popup } from "@/components/Popup/Popup";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import styles from "./CourseBookingPage.module.css";
import { useCourseBooking } from "@/hooks/useCourseBooking";

export default function CourseBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    course,
    isLoading,
    isError,
    formData,
    popup,
    bookingMutation,
    setPopup,
    handleInputChange,
    handleBooking,
  } = useCourseBooking(id, user);

  if (isLoading)
    return <DashboardLayout title="Memuat...">Loading...</DashboardLayout>;
  if (isError || !course)
    return (
      <DashboardLayout title="Error">Kursus tidak ditemukan</DashboardLayout>
    );

  return (
    <DashboardLayout title="Course Booking">
      <div className={styles.container}>
        <div className={styles.bookingSection}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>{course.name}</h1>
            <p>by {course.tutor}</p>
            <p>Category: {course.kategori}</p>
            <p>Duration: {course.durasi} Min</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <input value={user?.name || ""} readOnly />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
            />

            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
            />

            <button onClick={() => navigate(-1)}>Back</button>

            <button
              onClick={handleBooking}
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "Loading..." : "Book"}
            </button>
          </motion.div>
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        onAction={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
