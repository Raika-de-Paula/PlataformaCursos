// src/components/CourseEditor/ContentItem.jsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbGridDots } from "react-icons/tb";

export default function ContentItem({
  content,
  section,
  editingContentId,
  editContentForm,
  setEditContentForm,
  startEditContent,
  saveContentEdit,
  setEditingContentId,
  deleteContent
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
            type="file"
            onChange={(e) =>
              setEditContentForm({
                ...editContentForm,
                file: e.target.files[0]
              })
            }
          />

          <div className="editor-content-actions">
            <button type="button" onClick={() => saveContentEdit(section, content)}>
              Salvar
            </button>

            <button type="button" onClick={() => setEditingContentId(null)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="drag-handle"
            {...attributes}
            {...listeners}
          >
            <TbGridDots />
          </button>

          <div className="editor-content-info">
            <strong>{content.title}</strong>

            {content.description && <p>{content.description}</p>}

            {content.materialUrl && (
              <div className="editor-material-row">
                <a href={content.materialUrl} target="_blank" rel="noreferrer">
                  Abrir material
                </a>
              </div>
            )}
          </div>

          <div className="editor-content-actions">
            <button type="button" onClick={() => startEditContent(content)}>
              Editar
            </button>

            <button type="button" onClick={() => deleteContent(section, content)}>
              Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}