import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 menit

// 1. Fungsi untuk membaca localStorage di awal
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getInitialState = () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  const parsedUser = safeParse(storedUser);

  if (!parsedUser || !storedToken) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return { user: null, token: null };
  }

  // Langsung set header API jika token ada di awal
  api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

  return {
    user: parsedUser,
    token: storedToken,
  };
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const initialState = getInitialState();

  // Inisialisasi state secara langsung
  const [user, setUser] = useState(initialState.user);
  const [token, setToken] = useState(initialState.token);

  const login = (userData, userToken) => {
    if (!userData || !userToken) {
      console.error("Gagal set sesi: userData atau token kosong");
      return;
    }

    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  // WAJIB dibungkus useCallback karena masuk ke dependency array di useEffect
  const logout = useCallback(
    (isExpired = false) => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      // Tangani navigasi secara elegan, hindari penggunaan window.location
      if (isExpired) {
        navigate("/login?expired=true");
      } else {
        navigate("/login");
      }
    },
    [navigate],
  );

  useEffect(() => {
    let timeoutId;

    // Fungsi untuk mereset timer setiap kali ada aktivitas
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);

      // Jika tidak ada user login, jangan jalankan timer
      if (!token) return;

      timeoutId = setTimeout(() => {
        console.log("Sesi berakhir karena tidak ada aktivitas.");
        // Panggil logout dengan parameter true (menandakan expired)
        logout(true);
      }, INACTIVITY_TIMEOUT);
    };

    // Daftar event yang dianggap sebagai "Aktivitas User"
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Mulai memantau aktivitas jika user sedang login
    if (token) {
      resetTimer(); // Jalankan timer pertama kali

      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [token, logout]); // 'logout' sekarang aman diletakkan di sini karena sudah useCallback

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
