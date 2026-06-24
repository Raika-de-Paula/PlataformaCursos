import { Link } from "react-router-dom";

export default function NotificationDropdown({
  notifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
}) {
  return (
    <div className="notifications-dropdown">
      <div className="notifications-dropdown-header">
        <h3>Notificações</h3>

        <button type="button" onClick={markAllAsRead}>
          Marcar todas como lidas
        </button>
      </div>

      {notifications.length === 0 && (
        <p className="notification-empty">Nenhuma notificação.</p>
      )}

      <div className="notifications-dropdown-list">
        {notifications.slice(0, 4).map((notification) => (
          <div
            key={notification._id}
            className={`notification-dropdown-item ${
              !notification.isRead ? "unread" : ""
            }`}
          >
            {!notification.isRead && <span className="notification-dot"></span>}

            <div className="notification-dropdown-content">
              <div className="notification-title-row">
                <strong>{notification.title}</strong>
                <small>{notification.isRead ? "Lida" : "Agora mesmo"}</small>
              </div>

              <p>{notification.message}</p>

              <div className="notification-actions">
                {notification.link && (
                  <Link
                    to={notification.link}
                    onClick={() => markAsRead(notification._id)}
                  >
                    Abrir
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
          </div>
        ))}
      </div>

      <Link className="notifications-view-all" to="/notifications">
        Ver todas as notificações
      </Link>
    </div>
  );
}