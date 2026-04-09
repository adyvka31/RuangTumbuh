import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

// 1. Fungsi untuk membaca localStorage di awal (Menghindari set-state-in-effect)
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // Cek apakah datanya valid (bukan kata "undefined" atau kosong)
    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedToken &&
      storedToken !== "undefined"
    ) {
      return {
        user: JSON.parse(storedUser),
        token: storedToken,
      };
    }
  } catch (err) {
    // 2. Menggunakan variabel err (Menghindari no-unused-vars)
    console.error("Gagal membaca data sesi, mereset login...", err);
  }

  // Bersihkan jika data rusak/kosong
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const initialState = getInitialState();

  // Inisialisasi state secara langsung menggunakan data yang sudah difilter
  const [user, setUser] = useState(initialState.user);
  const [token, setToken] = useState(initialState.token);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
