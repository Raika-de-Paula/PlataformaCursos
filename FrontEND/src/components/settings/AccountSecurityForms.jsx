// src/components/settings/AccountSecurityForms.jsx

import { useState } from "react";
import api from "../../services/api";

export default function AccountSecurityForms({ showFeedback }) {
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const updateEmail = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/users/me/email", emailForm);
      showFeedback("success", "Email atualizado com sucesso!");
      setEmailForm({ newEmail: "", currentPassword: "" });
    } catch (error) {
      showFeedback(
        "error",
        error.response?.data?.message || "Erro ao atualizar email"
      );
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("error", "As senhas não coincidem.");
      return;
    }

    try {
      await api.patch("/users/me/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      showFeedback("success", "Senha atualizada com sucesso!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      showFeedback(
        "error",
        error.response?.data?.message || "Erro ao atualizar senha"
      );
    }
  };

  return (
    <>
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
                  setEmailForm({ ...emailForm, newEmail: e.target.value })
                }
                required
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
                required
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
              required
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
                required
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
                required
              />
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit">Alterar Senha</button>
          </div>
        </form>
      </section>
    </>
  );
}