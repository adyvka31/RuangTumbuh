import { useState, useEffect } from "react";
import api from "../utils/api";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.get("/notifications");
      // Interceptor api.js Anda mengembalikan response.data.data atau response.data
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      // Jika error 500, log error dari server
      console.error(
        "Detail Error Server:",
        error.response?.data || error.message,
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, loading, refresh: fetchNotifications };
};
