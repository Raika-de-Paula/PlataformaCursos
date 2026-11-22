// src/components/CourseEditor/SectionItem.jsx

import { useState } from "react";
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
import { Trash, PencilLine, ChevronUp, ChevronDown } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const isEditingSection = editingSectionId === section._id;

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

  const handleCloseSectionEdit = () => {
    setEditingSectionId(null);
    setEditingContentId(null);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`editor-section-item ${isDragging ? "is-dragging" : ""} ${
        isEditingSection ? "is-editing" : ""
      }`}
    >
      <div className="editor-section-header">
        <div className="editor-section-title">
          <strong>{section.title}</strong>
          <span>{section.contents?.length || 0} conteúdos</span>
        </div>

        <div className="editor-section-actions">
          <button
            type="button"
            className="drag-handle"
            title="Arrastar para reordenar"
            aria-label="Arrastar para reordenar"
            {...attributes}
            {...listeners}
          >
            <TbGridDots size = {16}/>
          </button>

          {isEditingSection ? (
            <button
              type="button"
              className="editor-icon-btn"
              title="Concluir edição da sessão"
              aria-label="Concluir edição da sessão"
              onClick={handleCloseSectionEdit}
            >
              <PencilLine size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="editor-icon-btn"
              title="Editar sessão e conteúdos"
              aria-label="Editar sessão e conteúdos"
              onClick={() => {
                setIsExpanded(false);
                startEditSection(section);
              }}
            >
              <PencilLine size={15} />
            </button>
          )}

          <button
            type="button"
            className="editor-icon-btn danger"
            title="Excluir sessão"
            aria-label="Excluir sessão"
            onClick={() => deleteSection(section)}
          >
            <Trash size={15} />
          </button>

          {!isEditingSection && (
            <button
              type="button"
              className="editor-expand-btn"
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? "Minimizar sessão" : "Visualizar conteúdos"}
              aria-label={isExpanded ? "Minimizar sessão" : "Visualizar conteúdos"}
            >
              {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </button>
          )}
        </div>
      </div>

      {/* MODO VISUALIZAÇÃO (seta): mostra só os títulos dos conteúdos */}
      {!isEditingSection && isExpanded && (
        <div className="editor-section-preview">
          {sortedContents.length === 0 ? (
            <p className="editor-empty-text">
              Nenhum conteúdo criado nesta sessão.
            </p>
          ) : (
            <ul className="editor-preview-list">
              {sortedContents.map((content, idx) => (
                <li key={content._id}>
                  <span>{idx + 1}.</span> {content.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* MODO EDIÇÃO (lápis): renomear sessão + conteúdos com lápis + adicionar conteúdo */}
      {isEditingSection && (
        <div className="editor-section-edit-body">
          <div className="editor-inline-edit">
            <input
              value={editSectionForm.title}
              placeholder="Nome da sessão"
              onChange={(e) =>
                setEditSectionForm({
                  ...editSectionForm,
                  title: e.target.value
                })
              }
            />

            <button type="button" onClick={() => saveSectionEdit(section)}>
              Salvar nome
            </button>
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
      )}
    </div>
  );
}