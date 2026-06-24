// src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import CourseDetails from "../pages/CourseDetails";
import ProtectedRoute from "../components/ProtectedRoute";
import MyCourses from "../pages/MyCourses";
import Profile from "../pages/Profile";
import CreateCourse from "../pages/CreateCourse";
import EditCourse from "../pages/EditCourse";
import PublicProfile from "../pages/PublicProfile";
import CourseSearch from "../pages/CourseSearch";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import AuthPage from "../pages/AuthPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/courses/:courseId" element={<CourseDetails />} />

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route path="/courses/search" element={<CourseSearch />} />

      <Route
        path="/profile/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/students/:userId" element={<PublicProfile />} />

      <Route
        path="/profile/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/create"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <CreateCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/courses/:courseId/edit"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <EditCourse />
          </ProtectedRoute>
        }
      />

      <Route path="/instructors/:userId" element={<PublicProfile />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/notifications" element={<Notifications />} />

      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
    </Routes>
  );
}