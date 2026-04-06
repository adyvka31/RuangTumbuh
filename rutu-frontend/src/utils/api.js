import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk otomatis menyisipkan token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
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

// Interceptor untuk menangani response, terutama untuk kasus 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      // Jika request punya meta (seperti pagination di SearchPage), kembalikan utuh
      if (response.data.meta) return response.data;
      // Jika tidak, langsung ambil payload datanya agar komponen Frontend tidak error!
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
