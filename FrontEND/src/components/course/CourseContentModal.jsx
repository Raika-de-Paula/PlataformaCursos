// src/components/course/CourseContentModal.jsx

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

  const materialsList =
    selectedContent.materials && selectedContent.materials.length > 0
      ? selectedContent.materials
      : selectedContent.materialUrl
      ? [
          {
            _id: "legacy",
            url: content.materialUrl,
            name:
              selectedContent.materialName ||
              getMaterialName(selectedContent.materialUrl),
            size: selectedContent.materialSize,
            type: selectedContent.type
          }
        ]
      : [];

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

          {materialsList.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
                width: "100%"
              }}
            >
              {materialsList.map((mat, idx) => {
                const displayName = mat.name || getMaterialName(mat.url);
                return (
                  <a
                    key={mat._id || idx}
                    className="modal-material-card"
                    href={mat.url}
                    target="_blank"
                    rel="noreferrer"
                    title={displayName}
                    style={{
                      marginTop: 0,
                      padding: "10px 12px",
                      maxWidth: "190px",
                      minWidth: "145px",
                      width: "auto",
                      flex: "1 1 160px"
                    }}
                  >
                    <div
                      className={`material-icon ${
                        mat.type || selectedContent.type
                      }`}
                      style={{ width: "32px", height: "32px", flexShrink: 0 }}
                    >
                      {getContentIcon(mat.type || selectedContent.type)}
                    </div>

                    <div style={{ minWidth: 0, overflow: "hidden" }}>
                      <strong
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {displayName}
                      </strong>

                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {getMaterialFormat({
                          ...selectedContent,
                          ...mat,
                          materialUrl: mat.url
                        })}
                        {mat.size ? ` · ${formatFileSize(mat.size)}` : ""}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
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