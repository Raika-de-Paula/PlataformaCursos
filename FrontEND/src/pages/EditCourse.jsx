// src/pages/EditCourse.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import CourseForm from "../components/CourseEditor/CourseForm";
import SectionItem from "../components/CourseEditor/SectionItem";
import "../styles/EditCourse.css";
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

export default function EditCourse() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [editingContentId, setEditingContentId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);

  const [editSectionForm, setEditSectionForm] = useState({ title: "" });
  const [editContentForm, setEditContentForm] = useState({ title: "", description: "", file: null });
  const [courseForm, setCourseForm] = useState({ title: "", description: "", category: "", status: "in_progress", thumbnail: null});
  const [sectionForm, setSectionForm] = useState({ title: "", order: 1 });
  const [contentForms, setContentForms] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        const data = response.data;

        setCourse(data);

        setCourseForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          status: data.status || "in_progress",
          thumbnail: null
        });

        setSectionForm((prev) => ({
          ...prev,
          order: (data.sections?.length || 0) + 1
        }));
      } catch {
        alert("Erro ao carregar curso");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const updateCourseInfo = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", courseForm.title);
      formData.append("description", courseForm.description);
      formData.append("category", courseForm.category);
      formData.append("status", courseForm.status);

      if (courseForm.thumbnail) {
        formData.append("thumbnail", courseForm.thumbnail);
      }

      const response = await api.patch(`/courses/${courseId}`, formData);

      setCourse(response.data.course);
      setThumbnailPreview(null);

      alert("Curso atualizado com sucesso!");
    } catch {
      alert("Erro ao atualizar curso");
    }
  };

  const handleSectionChange = (e) => {
    setSectionForm({ ...sectionForm, [e.target.name]: e.target.value });
  };

  const addSection = async (e) => {
    e.preventDefault();
    try {
      if (!sectionForm.title.trim()) {
        alert("Informe o nome da sessão");
        return;
      }
      const payload = {
        title: sectionForm.title,
        order: (course.sections?.length || 0) + 1
      };
      const response = await api.post(`/courses/${courseId}/sections`, payload);
      setCourse(response.data.course);
      setSectionForm({ title: "", order: response.data.course.sections.length + 1 });
      alert("Sessão adicionada!");
    } catch {
      alert("Erro ao adicionar sessão");
    }
  };

  const handleContentChange = (sectionId, field, value) => {
    setContentForms((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value }
    }));
  };

  const getFileType = (file) => {
    if (!file) return "text";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    return "link";
  };

  const addContent = async (e, section) => {
    e.preventDefault();
    try {
      const form = contentForms[section._id];
      if (!form?.title?.trim()) {
        alert("Informe o título do conteúdo");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      formData.append("type", getFileType(form.file));
      formData.append("order", section.contents.length + 1);

      if (form.file) {
        formData.append("material", form.file);
      }

      await api.post(`/courses/${courseId}/sections/${section._id}/contents`, formData);
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);

      setContentForms((prev) => ({
        ...prev,
        [section._id]: { title: "", description: "", file: null }
      }));
      alert("Conteúdo criado!");
    } catch {
      alert("Erro ao criar conteúdo");
    }
  };

  const startEditSection = (section) => {
    setEditingSectionId(section._id);
    setEditSectionForm({ title: section.title || "" });
  };

  const saveSectionEdit = async (section) => {
    try {
      if (!editSectionForm.title.trim()) {
        alert("Informe o nome da sessão");
        return;
      }
      const response = await api.patch(`/courses/${courseId}/sections/${section._id}`, {
        title: editSectionForm.title,
        order: section.order
      });
      setCourse(response.data.course);
      setEditingSectionId(null);
      alert("Sessão atualizada!");
    } catch {
      alert("Erro ao atualizar sessão");
    }
  };

  const deleteSection = async (section) => {
    if (!confirm(`Tem certeza que deseja excluir a sessão "${section.title}"? Todos os conteúdos serão removidos.`)) return;
    try {
      const response = await api.delete(`/courses/${courseId}/sections/${section._id}`);
      setCourse(response.data.course);
      alert("Sessão excluída!");
    } catch {
      alert("Erro ao excluir sessão");
    }
  };

  const deleteContent = async (section, content) => {
    if (!confirm(`Tem certeza que deseja excluir o conteúdo "${content.title}"?`)) return;
    try {
      const response = await api.delete(`/courses/${courseId}/sections/${section._id}/contents/${content._id}`);
      setCourse(response.data.course);
      alert("Conteúdo excluído!");
    } catch {
      alert("Erro ao excluir conteúdo");
    }
  };

  const startEditContent = (content) => {
    setEditingContentId(content._id);
    setEditContentForm({ title: content.title || "", description: content.description || "", file: null });
  };

  const saveContentEdit = async (section, content) => {
    try {
      const formData = new FormData();
      formData.append("title", editContentForm.title);
      formData.append("description", editContentForm.description);
      formData.append("order", content.order);

      if (editContentForm.file) {
        formData.append("type", getFileType(editContentForm.file));
        formData.append("material", editContentForm.file);
      }

      const response = await api.patch(`/courses/${courseId}/sections/${section._id}/contents/${content._id}`, formData);
      setCourse(response.data.course);
      setEditingContentId(null);
      alert("Conteúdo atualizado com sucesso!");
    } catch {
      alert("Erro ao atualizar conteúdo");
    }
  };

  if (!course) {
    return <h1>Carregando...</h1>;
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCourseForm({
      ...courseForm,
      thumbnail: file
    });

    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSectionDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sortedSections = [...course.sections].sort((a, b) => a.order - b.order);

    const oldIndex = sortedSections.findIndex(
      (section) => section._id === active.id
    );

    const newIndex = sortedSections.findIndex(
      (section) => section._id === over.id
    );

    const movedSections = arrayMove(sortedSections, oldIndex, newIndex);

    const updatedSections = movedSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));

    setCourse({
      ...course,
      sections: updatedSections
    });

    try {
      for (const section of updatedSections) {
        await api.patch(`/courses/${courseId}/sections/${section._id}`, {
          title: section.title,
          order: section.order
        });
      }
    } catch {
      alert("Erro ao reorganizar sessões");
    }
  };

  const handleContentDragEnd = async (event, section) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sortedContents = [...section.contents].sort((a, b) => a.order - b.order);

    const oldIndex = sortedContents.findIndex(
      (content) => content._id === active.id
    );

    const newIndex = sortedContents.findIndex(
      (content) => content._id === over.id
    );

    const movedContents = arrayMove(sortedContents, oldIndex, newIndex);

    const updatedContents = movedContents.map((content, index) => ({
      ...content,
      order: index + 1
    }));

    setCourse({
      ...course,
      sections: course.sections.map((currentSection) =>
        currentSection._id === section._id
          ? { ...currentSection, contents: updatedContents }
          : currentSection
      )
    });

    try {
      for (const content of updatedContents) {
        const formData = new FormData();

        formData.append("title", content.title);
        formData.append("description", content.description || "");
        formData.append("order", content.order);

        await api.patch(
          `/courses/${courseId}/sections/${section._id}/contents/${content._id}`,
          formData
        );
      }
    } catch {
      alert("Erro ao reorganizar conteúdos");
    }
  };

  return (
    <div className="edit-course-page">
      <div className="edit-course-header">
        <div>
          <h1>Configuração do Curso</h1>
          <p>Gerencie os detalhes, a capa, as sessões e os conteúdos do seu curso.</p>
        </div>

        <span className={`edit-course-status ${course.status}`}>
          {course.status === "in_progress" ? "Em andamento" : "Finalizado"}
        </span>
      </div>

      <div className="edit-course-grid">
        <CourseForm
          courseForm={courseForm}
          handleCourseChange={handleCourseChange}
          updateCourseInfo={updateCourseInfo}
          handleThumbnailChange={handleThumbnailChange}
          thumbnailPreview={thumbnailPreview}
          currentThumbnail={course.thumbnail}
        />

        <section className="editor-card course-sections-card">
          <h2>Estrutura de Sessões</h2>

          {course.sections?.length === 0 && (
            <p className="editor-empty-text">Nenhuma sessão criada ainda.</p>
          )}

          <div className="editor-sections-list">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={course.sections
                ?.slice()
                .sort((a, b) => a.order - b.order)
                .map((section) => section._id)}
              strategy={verticalListSortingStrategy}
            >
              {course.sections
                ?.slice()
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <SectionItem
                    key={section._id}
                    section={section}
                    index={index}
                    totalSections={course.sections.length}
                    editingSectionId={editingSectionId}
                    editSectionForm={editSectionForm}
                    setEditSectionForm={setEditSectionForm}
                    startEditSection={startEditSection}
                    saveSectionEdit={saveSectionEdit}
                    setEditingSectionId={setEditingSectionId}
                    deleteSection={deleteSection}
                    editingContentId={editingContentId}
                    editContentForm={editContentForm}
                    setEditContentForm={setEditContentForm}
                    startEditContent={startEditContent}
                    saveContentEdit={saveContentEdit}
                    setEditingContentId={setEditingContentId}
                    deleteContent={deleteContent}
                    contentForms={contentForms}
                    handleContentChange={handleContentChange}
                    addContent={addContent}
                    handleContentDragEnd={handleContentDragEnd}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </div>

          <form className="editor-add-section-form" onSubmit={addSection}>
            <h3>Adicionar Sessão</h3>

            <input
              name="title"
              placeholder="Nome da sessão. Ex: Módulo 1"
              value={sectionForm.title}
              onChange={handleSectionChange}
            />

            <button type="submit">+ Adicionar Sessão</button>
          </form>
        </section>
      </div>
    </div>
  );
}