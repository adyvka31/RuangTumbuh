import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import CustomCursor from "@components/CustomCursor/CustomCursor";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
const MyCoursePage = lazy(() => import("@/pages/MyCoursePage/MyCoursePage"));
const CourseDetailPage = lazy(
  () => import("@pages/CourseDetailPage/CourseDetailPage"),
);
const CourseBookingPage = lazy(
  () => import("@pages/CourseBookingPage/CourseBookingPage"),
);
const SchedulePage = lazy(() => import("@pages/SchedulePage/SchedulePage"));
const AddSchedulePage = lazy(
  () => import("@pages/AddSchedulePage/AddSchedulePage"),
);
const AddCoursePage = lazy(() => import("@pages/AddCoursePage/AddCoursePage"));
const ProfilePage = lazy(() => import("@pages/ProfilePage/ProfilePage"));
const PresencePage = lazy(() => import("@pages/PresencePage/PresencePage"));
const MessageDetailPage = lazy(
  () => import("@pages/MessageDetailPage/MessageDetailPage"),
);
const HelpCenterPage = lazy(
  () => import("@pages/HelpCenterPage/HelpCenterPage"),
);
const EditProfilePage = lazy(
  () => import("@pages/EditProfilePage/EditProfilePage"),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ReactLenis root>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CustomCursor />
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* --- Public Routes (User sudah login dilarang masuk sini) --- */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* --- Protected routes (User belum login dilarang masuk sini) --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/mycourses" element={<MyCoursePage />} />
                <Route path="/course/:id" element={<CourseDetailPage />} />
                <Route
                  path="/course-booking/:id"
                  element={<CourseBookingPage />}
                />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/add-schedule" element={<AddSchedulePage />} />
                <Route path="/add-course" element={<AddCoursePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/presence" element={<PresencePage />} />
                <Route path="/messages/:id" element={<MessageDetailPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/edit-course/:id" element={<AddCoursePage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ReactLenis>
  );
}
