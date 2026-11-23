// src/components/CourseEditor/ContentItem.jsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbGridDots } from "react-icons/tb";
import { PencilLine, Trash } from "lucide-react";

export default function ContentItem({
  content,
  section,
  editingContentId,
  editContentForm,
  setEditContentForm,
  startEditContent,
  saveContentEdit,
  setEditingContentId,
  deleteContent,
  removeContentMaterial
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: content._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };

  // Unifica materiais novos (array) e legado (materialUrl único)
  const existingMaterials =
    content.materials && content.materials.length > 0
      ? content.materials
      : content.materialUrl
      ? [
          {
            _id: "legacy",
            url: content.materialUrl,
            name: content.materialName || "Material anexado"
          }
        ]
      : [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`editor-content-item ${isDragging ? "is-dragging" : ""}`}
    >
      {editingContentId === content._id ? (
        <div className="editor-content-edit-form">
          <input
            value={editContentForm.title}
            placeholder="Título do conteúdo"
            onChange={(e) =>
              setEditContentForm({
                ...editContentForm,
                title: e.target.value
              })
            }
          />

          <textarea
            value={editContentForm.description}
            placeholder="Descrição do conteúdo"
            onChange={(e) =>
              setEditContentForm({
                ...editContentForm,
                description: e.target.value
              })
            }
            rows="3"
          />

          <input
            key={editContentForm.fileInputKey || 0}
            type="file"
            multiple
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files || []);
              const currentFiles = editContentForm.files || [];
              setEditContentForm({
                ...editContentForm,
                files: [...currentFiles, ...selectedFiles],
                fileInputKey: (editContentForm.fileInputKey || 0) + 1
              });
            }}
          />

          {(existingMaterials.length > 0 ||
            (editContentForm.files || []).length > 0) && (
            <div className="editor-material-chips">
              {existingMaterials.map((mat) => (
                <div key={mat._id} className="editor-material-chip">
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noreferrer"
                    className="editor-material-chip-title"
                    title={mat.name || "Material"}
                  >
                    {mat.name || "Material"}
                  </a>

                  <button
                    type="button"
                    className="editor-material-chip-remove"
                    onClick={() =>
                      removeContentMaterial(section, content, mat._id)
                    }
                    title="Excluir material"
                    aria-label={`Excluir ${mat.name || "material"}`}
                  >
                    ×
                  </button>
                </div>
              ))}

              {(editContentForm.files || []).map((file, idx) => (
                <div
                  key={`new-${file.name}-${idx}`}
                  className="editor-material-chip"
                >
                  <span
                    className="editor-material-chip-title"
                    title={file.name}
                  >
                    {file.name}
                  </span>

                  <button
                    type="button"
                    className="editor-material-chip-remove"
                    onClick={() =>
                      setEditContentForm({
                        ...editContentForm,
                        files: editContentForm.files.filter(
                          (_, i) => i !== idx
                        )
                      })
                    }
                    title="Remover arquivo"
                    aria-label={`Remover ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="editor-content-actions">
            <button
              type="button"
              onClick={() => saveContentEdit(section, content)}
            >
              Salvar
            </button>

            <button
              type="button"
              onClick={() => setEditingContentId(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="editor-content-info">
            <strong>{content.title}</strong>
          </div>

          <div className="editor-content-actions">
            <button
              type="button"
              className="drag-handle"
              title="Arrastar para reordenar"
              aria-label="Arrastar para reordenar"
              {...attributes}
              {...listeners}
            >
              <TbGridDots size={15} />
            </button>

            <button
              type="button"
              className="editor-icon-btn"
              title="Editar conteúdo"
              aria-label="Editar conteúdo"
              onClick={() => startEditContent(content)}
            >
              <PencilLine size={15} />
            </button>

            <button
              type="button"
              className="editor-icon-btn danger"
              title="Excluir conteúdo"
              aria-label="Excluir conteúdo"
              onClick={() => deleteContent(section, content)}
            >
              <Trash size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}