// src/pages/Notifications.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Notifications.css";
import { MdOutlineInsertComment } from "react-icons/md";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch {
      alert("Erro ao carregar notificações");
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      await loadNotifications();
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      loadNotifications();
    } catch {
      alert("Erro ao marcar notificação como lida");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      loadNotifications();
    } catch {
      alert("Erro ao marcar todas como lidas");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      loadNotifications();
    } catch {
      alert("Erro ao excluir notificação");
    }
  };

  const getNotificationCategory = (notification) => {
    const type = notification.type || "";

    if (type.includes("comment")) return "comments";
    if (type.includes("sale") || type.includes("enrollment")) return "sales";
    if (type.includes("system")) return "system";

    return "system";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;

    return getNotificationCategory(notification) === filter;
  });

  const getTimeLabel = (date) => {
    if (!date) return "";

    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) return "Agora";
    if (diffMinutes < 60) return `Há ${diffMinutes} minutos`;
    if (diffHours < 24) return `Há ${diffHours} horas`;

    return created.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getActionLabel = (notification) => {
    const category = getNotificationCategory(notification);

    if (category === "comments") return "Responder";
    if (category === "sales") return "Ver detalhes";
    if (category === "system") return "Conhecer novidades";

    return "Abrir";
  };

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div>
          <h1>Notificações</h1>
          <p>Acompanhe todas as atividades e interações nos seus cursos.</p>
        </div>

        <div className="notifications-header-actions">
          <button type="button" onClick={markAllAsRead}>
            Marcar todas como lidas
          </button>

          <Link to="/settings">
            Configurações
          </Link>
        </div>
      </header>

      <div className="notifications-filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>

        <button
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          Não lidas
        </button>

        <button
          className={filter === "comments" ? "active" : ""}
          onClick={() => setFilter("comments")}
        >
          Comentários
        </button>

        <button
          className={filter === "sales" ? "active" : ""}
          onClick={() => setFilter("sales")}
        >
          Vendas
        </button>

        <button
          className={filter === "system" ? "active" : ""}
          onClick={() => setFilter("system")}
        >
          Sistema
        </button>
      </div>

      <section className="notifications-list-card">
        {filteredNotifications.length === 0 && (
          <p className="notifications-empty">
            Nenhuma notificação encontrada.
          </p>
        )}

        {filteredNotifications.map((notification) => (
          <article
            key={notification._id}
            className={`notification-page-item ${
              !notification.isRead ? "unread" : ""
            }`}
          >
            <div className={`notification-page-icon ${getNotificationCategory(notification)}`}>
              {getNotificationCategory(notification) === "comments" && <MdOutlineInsertComment />}
            </div>

            <div className="notification-page-content">
              <div className="notification-page-title-row">
                <strong>{notification.title}</strong>

                <span>{getTimeLabel(notification.createdAt)}</span>
              </div>

              <p>{notification.message}</p>

              <div className="notification-page-actions">
                {notification.link && (
                  <Link
                    to={notification.link}
                    onClick={() => markAsRead(notification._id)}
                  >
                    {getActionLabel(notification)}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => deleteNotification(notification._id)}
                >
                  Excluir
                </button>
              </div>
            </div>

            {!notification.isRead && (
              <span className="notification-unread-dot"></span>
            )}
          </article>
        ))}

        {filteredNotifications.length > 0 && (
          <button type="button" className="load-more-notifications">
            Carregar notificações anteriores
          </button>
        )}
      </section>
    </main>
  );
}