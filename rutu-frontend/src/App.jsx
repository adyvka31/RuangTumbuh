import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from 'lenis/react'
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import Register from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import BookmarksPage from "./pages/BookmarksPage/BookmarksPage";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import CustomCursor from "./components/CustomCursor/CustomCursor";

export default function App() {
  return (
    <ReactLenis root>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}