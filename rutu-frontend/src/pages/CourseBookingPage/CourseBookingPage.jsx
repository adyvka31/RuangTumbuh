import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import styles from "./CourseBookingPage.module.css";
import { Popup } from "@/components/Popup/Popup";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function CourseBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    note: "",
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    description: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/courses/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCourse(data);
        } else {
          setPopup({
            isOpen: true,
            type: "danger",
            title: "Error",
            description: data.message || "Kursus tidak ditemukan",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setPopup({
          isOpen: true,
          type: "danger",
          title: "Error",
          description: "Gagal mengambil data kursus",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Gagal",
        description: "Harap pilih tanggal dan waktu!",
      });
      return;
    }

    try {
      // Gabungkan date dan time menjadi ISO string
      const scheduledAt = new Date(`${formData.date}T${formData.time}`);

      const response = await fetch("http://localhost:5001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: parseInt(id),
          studentId: currentUser.id,
          studentName: currentUser.name,
          scheduledAt: scheduledAt.toISOString(),
          note: formData.note,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPopup({
          isOpen: true,
          type: "success",
          title: "Berhasil!",
          description:
            "Permintaan booking kamu berhasil diajukan! Silakan cek di menu My Courses.",
        });
        setTimeout(() => {
          navigate("/mycourses");
        }, 2500);
      } else {
        setPopup({
          isOpen: true,
          type: "danger",
          title: "Booking Gagal",
          description:
            result.message || "Terjadi kesalahan saat memproses booking.",
        });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setPopup({
        isOpen: true,
        type: "danger",
        title: "Error",
        description: "Terjadi kesalahan koneksi.",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat...">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Memuat detail kursus...
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Error">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Kursus tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Course Booking">
      <div className={styles.container}>
        <div className={styles.bookingSection}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.leftContent}
          >
            <h1 className={styles.title}>{course.name}</h1>
            <p className={styles.author}>by {course.tutor}</p>
            <div
              style={{
                marginTop: "20px",
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              <span>Category: {course.kategori}</span>
              <br />
              <span>Duration: {course.durasi} Min</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.formContainer}
          >
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Your Name"
                className={styles.input}
                value={currentUser.name || ""}
                readOnly
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.selectWrapper}>
                <input
                  type="date"
                  name="date"
                  className={styles.input}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.selectWrapper}>
                <input
                  type="time"
                  name="time"
                  className={styles.input}
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <textarea
                name="note"
                placeholder="Apa yang ingin kamu pelajari?"
                className={styles.textarea}
                rows="4"
                value={formData.note}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className={styles.actionRow}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={styles.backBtn}
                onClick={() => navigate(-1)}
                type="button"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.submitBtn}
                onClick={handleBooking}
                type="submit"
              >
                Book Now 🚀
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        icon={popup.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
        title={popup.title}
        description={popup.description}
        buttonText={popup.type === "success" ? "OK" : "Tutup"}
        onAction={() => setPopup({ ...popup, isOpen: false })}
      />
    </DashboardLayout>
  );
}
