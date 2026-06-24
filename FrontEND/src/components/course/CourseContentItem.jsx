//src/components/course/CourseContentItem,jsx

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
  return (
    <div className="content-item">
      <div className={`content-icon ${content.type}`}>
        {getContentIcon(content.type)}
      </div>

      <div className="content-info">
        <strong>{content.title}</strong>

        <p className="content-description-one-line">
          {content.description || "Sem descrição."}
        </p>

        {content.materialUrl && (
          <a
            className="material-card"
            href={content.materialUrl}
            target="_blank"
            rel="noreferrer"
          >
            <div className={`material-icon ${content.type}`}>
              {getContentIcon(content.type)}
            </div>

            <div>
              <strong>
                {content.materialName ||
                  getMaterialName(content.materialUrl)}
              </strong>

              <span>
                {[
                  getMaterialFormat(content),
                  content.materialSize > 0
                    ? formatFileSize(content.materialSize)
                    : null
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          </a>
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