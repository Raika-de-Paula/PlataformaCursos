// src/contexts/NotificationContext.jsx

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Link } from "react-router-dom";
import { FiBell, FiX } from "react-icons/fi";
import api from "../services/api";
import { AuthContext } from "./authContext";
import "../styles/Notifications.css";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupNotification, setPopupNotification] = useState(null);

  const knownIdsRef = useRef(null);
  const popupTimerRef = useRef(null);

  const triggerPopup = useCallback((notification) => {
    setPopupNotification(notification);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);

    popupTimerRef.current = setTimeout(() => {
      setPopupNotification(null);
    }, 6000);
  }, []);

  const refreshNotifications = useCallback(async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!user && !token) {
      setNotifications([]);
      setUnreadCount(0);
      knownIdsRef.current = null;
      return;
    }

    try {
      const response = await api.get("/notifications", {
        params: { t: Date.now() }
      });
      const list = Array.isArray(response.data) ? response.data : [];

      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);

      // Na primeira busca após abrir a página, apenas memoriza os IDs existentes
      if (knownIdsRef.current === null) {
        knownIdsRef.current = new Set(list.map((n) => n._id));
        return;
      }

      // Nas buscas seguintes, qualquer ID novo não lido dispara o popup
      const brandNew = list.find(
        (n) => !knownIdsRef.current.has(n._id) && !n.isRead
      );

      list.forEach((n) => knownIdsRef.current.add(n._id));

      if (brandNew) {
        triggerPopup(brandNew);
      }
    } catch (error) {
      console.error("Erro ao sincronizar notificações:", error);
    }
  }, [user, triggerPopup]);

  useEffect(() => {
    refreshNotifications();

    const interval = setInterval(() => {
      refreshNotifications();
    }, 3000);

    window.addEventListener("focus", refreshNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshNotifications);
    };
  }, [refreshNotifications]);

  const markAsRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    await refreshNotifications();
  };

  const markAllAsRead = async () => {
    await api.patch("/notifications/read-all");
    await refreshNotifications();
  };

  const deleteNotification = async (notificationId) => {
    await api.delete(`/notifications/${notificationId}`);
    await refreshNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}

      {popupNotification && (
        <div className="realtime-notification-toast">
          <div className="realtime-toast-icon">
            <FiBell size={18} />
          </div>

          <div className="realtime-toast-body">
            <strong>{popupNotification.title}</strong>
            <p>{popupNotification.message}</p>

            {popupNotification.link && (
              <Link
                to={popupNotification.link}
                onClick={() => {
                  markAsRead(popupNotification._id);
                  setPopupNotification(null);
                }}
              >
                Abrir agora →
              </Link>
            )}
          </div>

          <button
            type="button"
            className="realtime-toast-close"
            onClick={() => setPopupNotification(null)}
            aria-label="Fechar notificação"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}