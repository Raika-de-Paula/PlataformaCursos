// src/components/settings/DeleteAccountSection.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import api from "../../services/api";
import { AuthContext } from "../../contexts/authContext";

export default function DeleteAccountSection({ showFeedback }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [deleteForm, setDeleteForm] = useState({
    currentPassword: "",
    confirmation: ""
  });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenConfirmModal = (e) => {
    e.preventDefault();

    if (!deleteForm.currentPassword.trim()) {
      showFeedback("error", "Informe sua senha atual para continuar.");
      return;
    }

    if (deleteForm.confirmation !== "APAGAR CONTA") {
      showFeedback(
        "error",
        'Digite "APAGAR CONTA" exatamente em maiúsculas para confirmar.'
      );
      return;
    }

    setConfirmModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await api.delete("/users/me", {
        data: deleteForm
      });

      setConfirmModalOpen(false);
      logout();
      navigate("/register");
    } catch (error) {
      setConfirmModalOpen(false);
      showFeedback(
        "error",
        error.response?.data?.message || "Erro ao apagar conta"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="settings-card settings-danger-card">
        <h2>Apagar Conta</h2>

        <p>
          Esta ação é permanente e todos os seus dados pessoais serão excluídos.
          Se você for instrutor, todos os seus cursos precisam estar
          finalizados (eles permanecerão na plataforma com autor anônimo).
        </p>

        <form onSubmit={handleOpenConfirmModal}>
          <label>Sua senha atual</label>
          <input
            type="password"
            placeholder="••••••••"
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

          <button type="submit">Apagar minha conta definitivamente</button>
        </form>
      </section>

      {confirmModalOpen && (
        <div
          className="settings-modal-overlay"
          onClick={() => !isDeleting && setConfirmModalOpen(false)}
        >
          <div
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="settings-modal-close"
              onClick={() => setConfirmModalOpen(false)}
              disabled={isDeleting}
              aria-label="Fechar"
            >
              <FiX size={20} />
            </button>

            <div className="settings-modal-icon">
              <FiAlertTriangle size={28} />
            </div>

            <h3>Tem certeza absoluta?</h3>
            <p>
              Você está prestes a excluir permanentemente sua conta da{" "}
              <strong>Neadro</strong>. Essa ação não pode ser desfeita e você
              perderá o acesso ao seu perfil e matrículas.
            </p>

            <div className="settings-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setConfirmModalOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-modal-danger"
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Apagando..." : "Sim, apagar minha conta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}