import React, { lazy, Suspense } from "react"; // <-- 1. Tambahkan Suspense di sini
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import CustomCursor from "@components/CustomCursor/CustomCursor";
import ProtectedRoute from "./routes/ProtectedRoute";

const HomePage = lazy(() => import("@pages/HomePage/HomePage"));
const Login = lazy(() => import("@pages/LoginPage/LoginPage"));
const Register = lazy(() => import("@pages/RegisterPage/RegisterPage"));
const DashboardPage = lazy(() => import("@pages/DashboardPage/DashboardPage"));
const SearchPage = lazy(() => import("@pages/SearchPage/SearchPage"));
const BookmarksPage = lazy(() => import("@pages/BookmarksPage/BookmarksPage"));
const MessagesPage = lazy(() => import("@pages/MessagesPage/MessagesPage"));
const NotificationPage = lazy(
  () => import("@pages/NotificationPage/NotificationPage"),
);
const BookingPage = lazy(() => import("@pages/BookingPage/BookingPage"));
const CourseDetailPage = lazy(
  () => import("@pages/CourseDetailPage/CourseDetailPage"),
);
const CourseBookingPage = lazy(
  () => import("@pages/CourseBookingPage/CourseBookingPage"),
);
const SchedulePage = lazy(() => import("@pages/SchedulePage/SchedulePage"));
const AddCoursePage = lazy(() => import("@pages/AddCoursePage/AddCoursePage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage/ProfilePage"));
const PresencePage = lazy(() => import("@pages/PresencePage/PresencePage"));
const MessageDetailPage = lazy(
  () => import("@pages/MessageDetailPage/MessageDetailPage"),
);

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

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/course/:id" element={<CourseDetailPage />} />
              <Route
                path="/course-booking/:id"
                element={<CourseBookingPage />}
              />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/add-course" element={<AddCoursePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/presence" element={<PresencePage />} />
              <Route path="/message/:id" element={<MessageDetailPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ReactLenis>
  );
}
