// src/components/course/CourseContentItem.jsx

import {
  getContentIcon,
  getMaterialFormat,
  getMaterialName,
  formatFileSize
} from "./courseUtils";

export default function CourseContentItem({
  content,
  sectionId,
  setSelectedContent
}) {
  const materialsList =
    content.materials && content.materials.length > 0
      ? content.materials
      : content.materialUrl
      ? [
          {
            _id: "legacy",
            url: content.materialUrl,
            name:
              content.materialName || getMaterialName(content.materialUrl),
            size: content.materialSize,
            type: content.type
          }
        ]
      : [];

  const visibleMaterials = materialsList.slice(0, 3);
  const remainingCount = materialsList.length - visibleMaterials.length;

  return (
    <div className="content-item">
      <div className={`content-icon ${content.type}`}>
        {getContentIcon(content.type)}
      </div>

      <div className="content-info" style={{ flex: 1, minWidth: 0, maxWidth: "100%" }}>
        <strong>{content.title}</strong>

        <p className="content-description-one-line">
          {content.description || "Sem descrição."}
        </p>

        {visibleMaterials.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px",
              width: "100%"
            }}
          >
            {visibleMaterials.map((mat, idx) => {
              const displayName = mat.name || getMaterialName(mat.url);
              return (
                <a
                  key={mat._id || idx}
                  className="material-card"
                  href={mat.url}
                  target="_blank"
                  rel="noreferrer"
                  title={displayName}
                  style={{
                    marginTop: 0,
                    padding: "8px 10px",
                    maxWidth: "185px",
                    minWidth: "130px",
                    width: "auto",
                    flex: "0 1 auto"
                  }}
                >
                  <div
                    className={`material-icon ${mat.type || content.type}`}
                    style={{ width: "30px", height: "30px", flexShrink: 0 }}
                  >
                    {getContentIcon(mat.type || content.type)}
                  </div>

                  <div style={{ minWidth: 0, overflow: "hidden" }}>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "0.82rem",
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
                        fontSize: "0.73rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {[
                        getMaterialFormat({
                          ...content,
                          ...mat,
                          materialUrl: mat.url
                        }),
                        mat.size > 0 ? formatFileSize(mat.size) : null
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                </a>
              );
            })}

            {remainingCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedContent({
                    ...content,
                    sectionId
                  })
                }
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#3b82f6",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "4px 6px",
                  whiteSpace: "nowrap"
                }}
              >
                + {remainingCount}{" "}
                {remainingCount === 1 ? "material" : "materiais"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="content-side-actions">
        <button
          className="instructions-btn"
          onClick={() =>
            setSelectedContent({
              ...content,
              sectionId
            })
          }
        >
          Ver instruções
        </button>
      </div>
    </div>
  );
}