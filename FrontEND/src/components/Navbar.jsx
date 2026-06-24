// src/components/Navbar.jsx

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import api from "../services/api";
import "../styles/Navbar.css";
import NotificationDropdown from "./NotificationDropdown";
import { FaSearch } from "react-icons/fa";
import { FiPlus, FiBell } from "react-icons/fi";

export default function Navbar() {
  const { user, activeRole, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/auth"];

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;

      try {
        const response = await api.get("/notifications");

        setNotifications(response.data);

        const unread = response.data.filter(
          (notification) => !notification.isRead
        );

        setUnreadCount(unread.length);
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
  }, [user]);

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

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `http://localhost:3000/${url}`;
  };

  const handleLogout = () => {
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

  const goToEditProfile = () => {
    navigate(
      activeRole === "student" ? "/profile/student" : "/profile/instructor"
    );
  };

  const goToPublicProfile = () => {
    navigate(
      activeRole === "student"
        ? `/students/${user.id}`
        : `/instructors/${user.id}`
    );
  };

  const openMenu = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setMenuOpen(true);
  };

  const closeMenu = () => {
    const id = setTimeout(() => {
      setMenuOpen(false);
    }, 100);

    setTimeoutId(id);
  };

  const handleSearch = () => {
    const term = searchTerm.trim();
    // CORREÇÃO: Removeu o bloqueio 'if (!term) return;' para aceitar pesquisas vazias

    if (activeRole === "student" || !activeRole) {
      navigate(`/courses/search?title=${encodeURIComponent(term)}`);
    }

    if (activeRole === "instructor") {
      navigate(`/instructor/courses?title=${encodeURIComponent(term)}`);
    }

    setSearchTerm("");
  };

  const markAsRead = async (notificationId) => {
  await api.patch(`/notifications/${notificationId}/read`);

  const response = await api.get("/notifications");
  setNotifications(response.data);

  setUnreadCount(response.data.filter((n) => !n.isRead).length);
};

const markAllAsRead = async () => {
  await api.patch("/notifications/read-all");

  const response = await api.get("/notifications");
  setNotifications(response.data);
  setUnreadCount(0);
};

const deleteNotification = async (notificationId) => {
  await api.delete(`/notifications/${notificationId}`);

  const response = await api.get("/notifications");
  setNotifications(response.data);

  setUnreadCount(response.data.filter((n) => !n.isRead).length);
};

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">N</div>
          <span className="logo-text">Neadro</span>
        </Link>
      </div>

      <div className="navbar-center">
        {user && (
          <div className="search-container">
            <input
              className="navbar-search"
              type="text"
              placeholder="Pesquisar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            {/* Lupa transformada em um Botão Clicável posicionado na extrema direita interna */}
            <button 
              type="button" 
              className="search-btn-icon" 
              onClick={handleSearch}
              aria-label="Buscar"
            >
              <FaSearch />
            </button>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {user && (
          <>
            {activeRole === "student" && (
              <Link to="/my-courses" className="nav-btn">
                Meus Cursos
              </Link>
            )}

            {activeRole === "instructor" && (
              <Link to="/instructor/courses/create" className="nav-btn">
                <FiPlus size={16} /> Criar curso
              </Link>
            )}

            <div className="notification-wrapper">
            <button
              className="notification-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <FiBell size={20} />

              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <NotificationDropdown
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                deleteNotification={deleteNotification}
              />
            )}
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
                  <button onClick={goToEditProfile}>Editar perfil</button>
                  <button onClick={goToPublicProfile}>Perfil público</button>
                  <button onClick={() => navigate("/settings")}>
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