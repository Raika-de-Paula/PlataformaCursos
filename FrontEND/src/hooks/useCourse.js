// src/hooks/useCourse.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function useCourse(courseId) {
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    status: "in_progress",
    thumbnail: null
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data);
        setCourseForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          status: data.status || "in_progress",
          thumbnail: null
        });
      } catch {
        alert("Erro ao carregar curso");
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course?.title) {
      document.title = `Editar: ${course.title} - Neadro`;
    }
  }, [course?.title]);

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCourseForm({ ...courseForm, thumbnail: file });
    setThumbnailPreview(URL.createObjectURL(file));
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

  const confirmDeleteCourse = async () => {
    setShowDeleteModal(false);
    try {
      await api.delete(`/courses/${courseId}`);
      alert("Curso excluído com sucesso!");
      navigate("/instructor/courses");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao excluir curso");
    }
  };

  return {
    course,
    setCourse,
    courseForm,
    thumbnailPreview,
    showDeleteModal,
    setShowDeleteModal,
    handleCourseChange,
    handleThumbnailChange,
    updateCourseInfo,
    confirmDeleteCourse
  };
}