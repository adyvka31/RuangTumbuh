import React, { lazy, Suspense } from "react"; // <-- 1. Tambahkan Suspense di sini
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import CustomCursor from "@components/CustomCursor/CustomCursor";

const HomePage = lazy(() => import("@pages/HomePage/HomePage"));
const Login = lazy(() => import("@pages/LoginPage/LoginPage"));
const Register = lazy(() => import("@pages/RegisterPage/RegisterPage"));

const PageLoader = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
    }}
  >
    Loading...
  </div>
);

export default function App() {
  return (
    <ReactLenis root>
      <BrowserRouter>
        <CustomCursor />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ReactLenis>
  );
}
