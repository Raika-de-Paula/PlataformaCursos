// src/components/CourseEditor/SectionItem.jsx

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbGridDots } from "react-icons/tb";
import ContentItem from "./ContentItem";

export default function SectionItem({
  section,
  editingSectionId,
  editSectionForm,
  setEditSectionForm,
  startEditSection,
  saveSectionEdit,
  setEditingSectionId,
  deleteSection,
  editingContentId,
  editContentForm,
  setEditContentForm,
  startEditContent,
  saveContentEdit,
  setEditingContentId,
  deleteContent,
  contentForms,
  handleContentChange,
  addContent,
  handleContentDragEnd
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section._id });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1
  };

  const sortedContents = [...(section.contents || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`editor-section-item ${isDragging ? "is-dragging" : ""}`}
    >
      <div className="editor-section-header">
        {editingSectionId === section._id ? (
          <div className="editor-inline-edit">
            <input
              value={editSectionForm.title}
              onChange={(e) =>
                setEditSectionForm({
                  ...editSectionForm,
                  title: e.target.value
                })
              }
            />

            <button type="button" onClick={() => saveSectionEdit(section)}>
              Salvar
            </button>

            <button type="button" onClick={() => setEditingSectionId(null)}>
              Cancelar
            </button>
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

            <div
              className="editor-section-title drag-area"
              {...attributes}
              {...listeners}
            >
              <strong>{section.title}</strong>
              <span>{section.contents?.length || 0} conteúdos</span>
            </div>

            <div className="editor-section-actions">
              <button type="button" onClick={() => startEditSection(section)}>
                Editar
              </button>

              <button type="button" onClick={() => deleteSection(section)}>
                Excluir
              </button>
            </div>
          </>
        )}
      </div>

      <div className="editor-content-list">
        {sortedContents.length === 0 && (
          <p className="editor-empty-text">
            Nenhum conteúdo criado nesta sessão.
          </p>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleContentDragEnd(event, section)}
        >
          <SortableContext
            items={sortedContents.map((content) => content._id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedContents.map((content) => (
              <ContentItem
                key={content._id}
                content={content}
                section={section}
                editingContentId={editingContentId}
                editContentForm={editContentForm}
                setEditContentForm={setEditContentForm}
                startEditContent={startEditContent}
                saveContentEdit={saveContentEdit}
                setEditingContentId={setEditingContentId}
                deleteContent={deleteContent}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <form
        className="editor-add-content-form"
        onSubmit={(e) => addContent(e, section)}
      >
        <h4>Adicionar Conteúdo</h4>

        <input
          placeholder="Título do conteúdo"
          value={contentForms[section._id]?.title || ""}
          onChange={(e) =>
            handleContentChange(section._id, "title", e.target.value)
          }
        />

        <textarea
          placeholder="Descrição do conteúdo"
          value={contentForms[section._id]?.description || ""}
          onChange={(e) =>
            handleContentChange(section._id, "description", e.target.value)
          }
          rows="3"
        />

        <input
          type="file"
          onChange={(e) =>
            handleContentChange(section._id, "file", e.target.files[0])
          }
        />

        <button type="submit">+ Adicionar Conteúdo</button>
      </form>
    </div>
  );
}