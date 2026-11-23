// src/hooks/useContents.js
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import api from "../services/api";

const getFileType = (file) => {
  if (!file) return "text";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  return "link";
};

export default function useContents(courseId, course, setCourse) {
  const [contentForms, setContentForms] = useState({});
  const [editingContentId, setEditingContentId] = useState(null);
  const [editContentForm, setEditContentForm] = useState({
    title: "",
    description: "",
    files: [],
    fileInputKey: 0
  });

  const handleContentChange = (sectionId, field, value) => {
    setContentForms((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value }
    }));
  };

  const addContent = async (e, section) => {
    e.preventDefault();
    try {
      const form = contentForms[section._id];
      if (!form?.title?.trim()) {
        alert("Informe o título do conteúdo");
        return;
      }

      const files = form.files || [];
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      formData.append("type", files.length > 0 ? getFileType(files[0]) : "text");
      formData.append("order", section.contents.length + 1);
      files.forEach((file) => formData.append("materials", file));

      await api.post(
        `/courses/${courseId}/sections/${section._id}/contents`,
        formData
      );
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);

      setContentForms((prev) => ({
        ...prev,
        [section._id]: {
          title: "",
          description: "",
          files: [],
          fileInputKey: (prev[section._id]?.fileInputKey || 0) + 1
        }
      }));
      alert("Conteúdo criado!");
    } catch {
      alert("Erro ao criar conteúdo");
    }
  };

  const startEditContent = (content) => {
    setEditingContentId(content._id);
    setEditContentForm({
      title: content.title || "",
      description: content.description || "",
      files: [],
      fileInputKey: 0
    });
  };

  const saveContentEdit = async (section, content) => {
    try {
      const formData = new FormData();
      formData.append("title", editContentForm.title);
      formData.append("description", editContentForm.description);
      formData.append("order", content.order);
      (editContentForm.files || []).forEach((file) =>
        formData.append("materials", file)
      );

      const response = await api.patch(
        `/courses/${courseId}/sections/${section._id}/contents/${content._id}`,
        formData
      );
      setCourse(response.data.course);
      setEditingContentId(null);
      alert("Conteúdo atualizado com sucesso!");
    } catch {
      alert("Erro ao atualizar conteúdo");
    }
  };

  const deleteContent = async (section, content) => {
    if (
      !confirm(`Tem certeza que deseja excluir o conteúdo "${content.title}"?`)
    )
      return;
    try {
      const response = await api.delete(
        `/courses/${courseId}/sections/${section._id}/contents/${content._id}`
      );
      setCourse(response.data.course);
      alert("Conteúdo excluído!");
    } catch {
      alert("Erro ao excluir conteúdo");
    }
  };

  const removeContentMaterial = async (section, content, materialId) => {
    if (!confirm("Tem certeza que deseja remover este material?")) return;
    try {
      const response = await api.delete(
        `/courses/${courseId}/sections/${section._id}/contents/${content._id}/materials/${materialId}`
      );
      setCourse(response.data.course);
      alert("Material removido com sucesso!");
    } catch {
      alert("Erro ao remover material");
    }
  };

  const handleContentDragEnd = async ({ active, over }, section) => {
    if (!over || active.id === over.id) return;

    const sorted = [...section.contents].sort((a, b) => a.order - b.order);
    const oldIndex = sorted.findIndex((c) => c._id === active.id);
    const newIndex = sorted.findIndex((c) => c._id === over.id);

    const updatedContents = arrayMove(sorted, oldIndex, newIndex).map(
      (content, index) => ({ ...content, order: index + 1 })
    );

    setCourse({
      ...course,
      sections: course.sections.map((s) =>
        s._id === section._id ? { ...s, contents: updatedContents } : s
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

  return {
    contentForms,
    editingContentId,
    setEditingContentId,
    editContentForm,
    setEditContentForm,
    handleContentChange,
    addContent,
    startEditContent,
    saveContentEdit,
    deleteContent,
    removeContentMaterial,
    handleContentDragEnd
  };
}