import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAddCourse = () => {
  const navigate = useNavigate();

  const [setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    tutorId: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      setFormData((prev) => ({ ...prev, tutorId: user.id }));
    } else {
      navigate("/login");
    }
  }, [navigate]);
};
