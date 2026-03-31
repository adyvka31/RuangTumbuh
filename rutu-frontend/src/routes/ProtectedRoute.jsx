import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Mengecek apakah ada 'token' yang tersimpan di browser
  const token = localStorage.getItem("token");

  // Jika TIDAK ADA token (berarti guest/belum login), usir ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ADA token, silakan lewat dan tampilkan halamannya (Outlet)
  return <Outlet />;
}
