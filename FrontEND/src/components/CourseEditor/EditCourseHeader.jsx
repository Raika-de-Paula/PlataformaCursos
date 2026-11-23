// src/components/CourseEditor/EditCourseHeader.jsx
export default function EditCourseHeader({ status, onDeleteClick }) {
  return (
    <div className="edit-course-header">
      <div>
        <h1>Configuração do Curso</h1>
        <p>
          Gerencie os detalhes, a capa, as sessões e os conteúdos do seu curso.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span className={`edit-course-status ${status}`}>
          {status === "in_progress" ? "Em andamento" : "Finalizado"}
        </span>

        <button
          type="button"
          onClick={onDeleteClick}
          style={{
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Excluir Curso
        </button>
      </div>
    </div>
  );
}