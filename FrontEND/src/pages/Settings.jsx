// src/pages/Settings.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/authContext";
import "../styles/Settings.css";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [deleteForm, setDeleteForm] = useState({
    currentPassword: "",
    confirmation: ""
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled !== false
  );

  const updateEmail = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/users/me/email", emailForm);
      alert("Email atualizado com sucesso!");

      setEmailForm({ newEmail: "", currentPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao atualizar email");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      await api.patch("/users/me/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      alert("Senha atualizada com sucesso!");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao atualizar senha");
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Tem certeza que deseja apagar sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmed) return;

    try {
      await api.delete("/users/me", {
        data: deleteForm
      });

      alert("Conta apagada com sucesso.");

      logout();
      navigate("/register");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao apagar conta");
    }
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

      alert(newValue ? "Notificações ativadas." : "Notificações desativadas.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Erro ao atualizar preferência de notificações"
      );
    }
  };

  return (
    <main className="settings-page">
      <h1>Configurações da Conta</h1>

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

      <section className="settings-card">
        <h2>Alterar Email</h2>

        <form onSubmit={updateEmail}>
          <div className="settings-form-grid">
            <div>
              <label>Novo email</label>
              <input
                type="email"
                placeholder="novo@email.com"
                value={emailForm.newEmail}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    newEmail: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label>Senha atual</label>
              <input
                type="password"
                placeholder="••••••••"
                value={emailForm.currentPassword}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    currentPassword: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit">Atualizar Email</button>
          </div>
        </form>
      </section>

      <section className="settings-card">
        <h2>Alterar Senha</h2>

        <form onSubmit={updatePassword}>
          <div>
            <label>Senha atual</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value
                })
              }
            />
          </div>

          <div className="settings-form-grid">
            <div>
              <label>Nova senha</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label>Confirmar nova senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit">Alterar Senha</button>
          </div>
        </form>
      </section>

      <section className="settings-card settings-danger-card">
        <h2>Apagar Conta</h2>

        <p>
          Esta ação é permanente e todos os seus dados serão excluídos. Para
          confirmar, siga as instruções abaixo.
        </p>

        <form onSubmit={deleteAccount}>
          <label>Sua senha atual</label>
          <input
            type="password"
            value={deleteForm.currentPassword}
            onChange={(e) =>
              setDeleteForm({
                ...deleteForm,
                currentPassword: e.target.value
              })
            }
          />

          <label>Digite APAGAR CONTA para confirmar</label>
          <input
            type="text"
            placeholder="APAGAR CONTA"
            value={deleteForm.confirmation}
            onChange={(e) =>
              setDeleteForm({
                ...deleteForm,
                confirmation: e.target.value
              })
            }
          />

          <button type="submit">
            Apagar minha conta definitivamente
          </button>
        </form>
      </section>
    </main>
  );
}