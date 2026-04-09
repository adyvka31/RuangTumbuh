import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request: Otomatis menyisipkan token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor Response: Penanganan Format Baru & 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    // Ekstrak payload 'data' dari standardisasi JSON backend
    if (response.data && response.data.success !== undefined) {
      if (response.data.meta) return response.data;

      // Jika response.data.data ada, kembalikan. Jika tidak, kembalikan response.data utuh.
      return response.data.data !== undefined
        ? response.data.data
        : response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Sesi berakhir, silakan login ulang.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export default api;
