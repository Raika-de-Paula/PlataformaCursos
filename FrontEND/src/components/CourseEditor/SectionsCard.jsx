// src/components/CourseEditor/SectionsCard.jsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import SectionItem from "./SectionItem";

export default function SectionsCard({ course, sections, contents }) {
  const sortedSections = (course.sections || [])
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <section className="editor-card course-sections-card">
      <h2>Estrutura de Sessões</h2>

      {sortedSections.length === 0 && (
        <p className="editor-empty-text">Nenhuma sessão criada ainda.</p>
      )}

      <div className="editor-sections-list">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={sections.handleSectionDragEnd}
        >
          <SortableContext
            items={sortedSections.map((s) => s._id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map((section, index) => (
              <SectionItem
                key={section._id}
                section={section}
                index={index}
                totalSections={sortedSections.length}
                editingSectionId={sections.editingSectionId}
                editSectionForm={sections.editSectionForm}
                setEditSectionForm={sections.setEditSectionForm}
                startEditSection={sections.startEditSection}
                saveSectionEdit={sections.saveSectionEdit}
                setEditingSectionId={sections.setEditingSectionId}
                deleteSection={sections.deleteSection}
                editingContentId={contents.editingContentId}
                editContentForm={contents.editContentForm}
                setEditContentForm={contents.setEditContentForm}
                startEditContent={contents.startEditContent}
                saveContentEdit={contents.saveContentEdit}
                setEditingContentId={contents.setEditingContentId}
                deleteContent={contents.deleteContent}
                removeContentMaterial={contents.removeContentMaterial}
                contentForms={contents.contentForms}
                handleContentChange={contents.handleContentChange}
                addContent={contents.addContent}
                handleContentDragEnd={contents.handleContentDragEnd}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <form className="editor-add-section-form" onSubmit={sections.addSection}>
        <h3>Adicionar Sessão</h3>

        <input
          name="title"
          placeholder="Nome da sessão. Ex: Módulo 1"
          value={sections.sectionForm.title}
          onChange={sections.handleSectionChange}
        />

        <button type="submit">+ Adicionar Sessão</button>
      </form>
    </section>
  );
}