// src/hooks/useSections.js
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import api from "../services/api";

export default function useSections(courseId, course, setCourse) {
  const [sectionForm, setSectionForm] = useState({ title: "" });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionForm, setEditSectionForm] = useState({ title: "" });

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
      const response = await api.post(`/courses/${courseId}/sections`, {
        title: sectionForm.title,
        order: (course.sections?.length || 0) + 1
      });
      setCourse(response.data.course);
      setSectionForm({ title: "" });
      alert("Sessão adicionada!");
    } catch {
      alert("Erro ao adicionar sessão");
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
      const response = await api.patch(
        `/courses/${courseId}/sections/${section._id}`,
        { title: editSectionForm.title, order: section.order }
      );
      setCourse(response.data.course);
      alert("Sessão atualizada!");
    } catch {
      alert("Erro ao atualizar sessão");
    }
  };

  const deleteSection = async (section) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir a sessão "${section.title}"? Todos os conteúdos serão removidos.`
      )
    )
      return;
    try {
      const response = await api.delete(
        `/courses/${courseId}/sections/${section._id}`
      );
      setCourse(response.data.course);
      alert("Sessão excluída!");
    } catch {
      alert("Erro ao excluir sessão");
    }
  };

  const handleSectionDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const sorted = [...course.sections].sort((a, b) => a.order - b.order);
    const oldIndex = sorted.findIndex((s) => s._id === active.id);
    const newIndex = sorted.findIndex((s) => s._id === over.id);

    const updatedSections = arrayMove(sorted, oldIndex, newIndex).map(
      (section, index) => ({ ...section, order: index + 1 })
    );

    setCourse({ ...course, sections: updatedSections });

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

  return {
    sectionForm,
    editingSectionId,
    setEditingSectionId,
    editSectionForm,
    setEditSectionForm,
    handleSectionChange,
    addSection,
    startEditSection,
    saveSectionEdit,
    deleteSection,
    handleSectionDragEnd
  };
}