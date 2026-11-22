// src/routes/AppRoutes.jsx

import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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

function TitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const titulosEstaticos = {
      "/": "Início - Neadro",
      "/login": "Entrar - Neadro",
      "/register": "Cadastrar - Neadro",
      "/my-courses": "Início - Meus cursos",
      "/courses/search": "Buscar cursos - Neadro",
      "/profile/student": "Meu perfil - Aluno",
      "/profile/instructor": "Meu perfil - Instrutor",
      "/instructor/courses": "Início - Meus cursos criados",
      "/instructor/courses/create": "Criar novo curso - Neadro",
      "/settings": "Configurações",
      "/notifications": "Minhas notificações",
    };

    if (titulosEstaticos[pathname]) {
      document.title = titulosEstaticos[pathname];
    } else if (pathname.startsWith("/instructor/courses/") && pathname.endsWith("/edit")) {
      document.title = "Editar curso - Neadro";
    } else if (pathname.startsWith("/courses/")) {
      document.title = "Detalhes do curso - Neadro";
    } else if (pathname.startsWith("/students/")) {
      document.title = "Perfil do aluno - Neadro";
    } else if (pathname.startsWith("/instructors/")) {
      document.title = "Perfil do instrutor - Neadro";
    } else {
      document.title = "Neadro - Plataforma de Cursos";
    }
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <TitleManager />
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
    </>
  );
}