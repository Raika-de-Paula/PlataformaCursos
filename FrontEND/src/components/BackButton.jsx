// src/components/BackButton.jsx

import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton({ fallback = "/", inline = false, style = {} }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  const button = (
    <button
      type="button"
      onClick={handleBack}
      className="neadro-back-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        border: "none",
        color: "inherit",
        opacity: 0.78,
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer",
        padding: "0",
        marginBottom: inline ? "18px" : "0",
        transition: "opacity 0.15s ease",
        ...style
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.78")}
    >
      <FiArrowLeft size={17} />
      <span>Voltar</span>
    </button>
  );

  if (inline) return button;

  return (
    <div
      className="neadro-back-wrapper"
      style={{
        width: "100%",
        padding: "24px 32px 12px",
        boxSizing: "border-box"
      }}
    >
      {button}
    </div>
  );
}