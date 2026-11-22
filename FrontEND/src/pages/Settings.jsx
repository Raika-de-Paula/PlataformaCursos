// src/pages/Settings.jsx

import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/authContext";
import AccountSecurityForms from "../components/settings/AccountSecurityForms";
import DeleteAccountSection from "../components/settings/DeleteAccountSection";
import "../styles/Settings.css";

export default function Settings() {
  const { user } = useContext(AuthContext);

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled !== false
  );
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const toggleNotifications = async () => {
    try {
      const newValue = !notificationsEnabled;

      const response = await api.patch("/users/me/notifications", {
        notificationsEnabled: newValue
      });

      setNotificationsEnabled(response.data.user.notificationsEnabled);

      const updatedUser = {
        ...user,
        notificationsEnabled: response.data.user.notificationsEnabled
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      showFeedback(
        "success",
        newValue ? "Notificações ativadas." : "Notificações desativadas."
      );
    } catch (error) {
      showFeedback(
        "error",
        error.response?.data?.message ||
          "Erro ao atualizar preferência de notificações"
      );
    }
  };

  return (
    <main className="settings-page">
      <h1>Configurações da Conta</h1>

      {feedback && (
        <div className={`settings-toast ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <section className="settings-card settings-notification-card">
        <div>
          <h2>Notificações</h2>
          <p>Gerencie como você recebe alertas e atualizações.</p>

          <small>
            Você receberá notificações sobre novos cursos e mensagens.
          </small>
        </div>

        <label className="settings-switch">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
          />
          <span></span>
        </label>
      </section>

      <AccountSecurityForms showFeedback={showFeedback} />

      <DeleteAccountSection showFeedback={showFeedback} />
    </main>
  );
}