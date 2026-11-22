// src/components/Navbar.jsx

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import api from "../services/api";
import "../styles/Navbar.css";
import NotificationDropdown from "./NotificationDropdown";
import { NotificationContext } from "../contexts/NotificationContext";
import NavbarSearch from "./NavbarSearch";
import { FiPlus, FiBell, FiBookOpen } from "react-icons/fi";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, activeRole, logout } = useContext(AuthContext);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useContext(NotificationContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/auth"];

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Sincroniza o estado do ícone caso o tema do sistema mude enquanto não há preferência manual salva
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!user || !activeRole) {
        setProfilePhotoUrl("");
        return;
      }

      try {
        const route =
          activeRole === "student" ? "/students/me" : "/instructors/me";

        const response = await api.get(route);
        setProfilePhotoUrl(response.data.photoUrl || "");
      } catch (error) {
        console.error(error);
        setProfilePhotoUrl("");
      }
    };

    loadProfilePhoto();
  }, [user, activeRole]);

  // Garante que o menu do avatar feche ao mudar de rota, logar ou deslogar
  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setMenuOpen(false);
  }, [location.pathname, user]);

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}/${url}`;
  };

  const handleLogout = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setMenuOpen(false);
    logout();
    setProfilePhotoUrl("");
    navigate("/");
  };

  const getInitials = () => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const openMenu = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    const id = setTimeout(() => setMenuOpen(false), 100);
    setTimeoutId(id);
  };

  return (
    <nav className={`navbar ${searchExpanded ? "search-active" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">N</div>
          <span className="logo-text">Neadro</span>
        </Link>
      </div>

      <div className="navbar-center">
        {user && (
          <NavbarSearch
            activeRole={activeRole}
            searchExpanded={searchExpanded}
            setSearchExpanded={setSearchExpanded}
          />
        )}
      </div>

      <div className="navbar-right">
        {user && (
          <>
            {activeRole === "student" && (
              <Link
                to="/my-courses"
                className="nav-btn action-icon-btn"
                title="Meus Cursos"
              >
                <FiBookOpen size={17} />
                <span className="nav-btn-text">Meus Cursos</span>
              </Link>
            )}

            {activeRole === "instructor" && (
              <Link
                to="/instructor/courses/create"
                className="nav-btn action-icon-btn"
                title="Criar curso"
              >
                <FiPlus size={18} />
                <span className="nav-btn-text">Criar curso</span>
              </Link>
            )}

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
              aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="notification-wrapper">
              <button
                type="button"
                className="notification-btn"
                aria-label="Notificações"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              <NotificationDropdown
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                deleteNotification={deleteNotification}
              />
            </div>

            <div
              className="navbar-profile"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              <div className="navbar-avatar">
                {profilePhotoUrl ? (
                  <img
                    src={getImageUrl(profilePhotoUrl)}
                    alt="Foto de perfil"
                    className="navbar-avatar-img"
                  />
                ) : (
                  getInitials()
                )}
              </div>

              {menuOpen && (
                <div className="navbar-menu">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(
                        activeRole === "student"
                          ? "/profile/student"
                          : "/profile/instructor"
                      );
                    }}
                  >
                    Editar perfil
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(
                        activeRole === "student"
                          ? `/students/${user.id}`
                          : `/instructors/${user.id}`
                      );
                    }}
                  >
                    Perfil público
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/settings");
                    }}
                  >
                    Configurações
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{ color: "#ef4444", fontWeight: "600" }}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="nav-btn">
              Login
            </Link>

            <Link
              to="/register"
              className="nav-btn"
              style={{
                background: "#0d4af2",
                color: "#fff",
                borderColor: "#0d4af2"
              }}
            >
              Cadastro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}