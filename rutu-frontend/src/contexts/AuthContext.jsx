import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

// Buat Provider (Pembungkus Aplikasi)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Untuk menahan render sebelum localStorage terbaca
  const navigate = useNavigate();

  // Membaca data dari localStorage saat aplikasi pertama kali dimuat (Refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Fungsi khusus untuk Login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  // Fungsi khusus untuk Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fungsi untuk update data (Misal: setelah Edit Profil)
  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUserData,
        isAuthenticated: !!user,
      }}
    >
      {/* Jangan render aplikasi sampai proses baca localStorage selesai */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Buat Custom Hook agar mudah dipanggil di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};
