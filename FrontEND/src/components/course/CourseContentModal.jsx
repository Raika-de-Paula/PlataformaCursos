import Comments from "../Comments";
import { useEffect } from "react";
import {
  getContentIcon,
  getMaterialFormat,
  getMaterialName,
  formatFileSize
} from "./courseUtils";

export default function CourseContentModal({
  selectedContent,
  setSelectedContent,
  courseId
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedContent(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setSelectedContent]);

  if (!selectedContent) return null;

  const formatDate = (date) => {
    if (!date) return "Data não informada";

    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedContent(null)}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={() => setSelectedContent(null)}
        >
          ×
        </button>

        <div className="modal-left">
          <div className="modal-content-header">
            <h2>{selectedContent.title}</h2>

            <p className="modal-subtitle">
              Publicado em:{" "}
              {formatDate(selectedContent.createdAt || selectedContent.updatedAt)}
            </p>
          </div>

          <p className="modal-description">
            {selectedContent.description || "Sem descrição."}
          </p>

          {selectedContent.materialUrl && (
            <a
              className="modal-material-card"
              href={selectedContent.materialUrl}
              target="_blank"
              rel="noreferrer"
            >
              <div className={`material-icon ${selectedContent.type}`}>
                {getContentIcon(selectedContent.type)}
              </div>

              <div>
                <strong>
                  {selectedContent.materialName ||
                    getMaterialName(selectedContent.materialUrl)}
                </strong>

                <span>
                  {getMaterialFormat(selectedContent)}
                  {selectedContent.materialSize &&
                    ` · ${formatFileSize(selectedContent.materialSize)}`}
                </span>
              </div>
            </a>
          )}
        </div>

        <aside className="modal-comments">
          <h3>Comentários</h3>

          <Comments
            courseId={courseId}
            sectionId={selectedContent.sectionId}
            contentId={selectedContent._id}
          />
        </aside>
      </div>
    </div>
  );
}