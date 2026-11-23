// src/pages/CourseDetails.jsx

import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/CourseDetails.css";

import BackButton from "../components/BackButton";
import CourseHero from "../components/course/CourseHero";
import CourseInfoCard from "../components/course/CourseInfoCard";
import CourseSectionCard from "../components/course/CourseSectionCard";
import CourseContentModal from "../components/course/CourseContentModal";
import ConfirmModal from "../components/ConfirmModal";
import { AuthContext } from "../contexts/authContext";

export default function CourseDetails() {
  const { courseId } = useParams();
  const { activeRole } = useContext(AuthContext);
  const isStudent = activeRole === "student";

  const [course, setCourse] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const targetContentId = searchParams.get("contentId");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);

        const defaultOpen = {};

        response.data.sections?.forEach((section) => {
          defaultOpen[section._id] = true;
        });

        setOpenSections(defaultOpen);
      } catch {
        alert("Erro ao carregar curso");
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course?.title) {
      document.title = `${course.title} - Neadro`;
    }
  }, [course]);

  useEffect(() => {
    if (!targetContentId || !course?.sections) return;

    for (const section of course.sections) {
      const foundContent = section.contents?.find(
        (item) => item._id === targetContentId
      );

      if (foundContent) {
        setSelectedContent({
          ...foundContent,
          sectionId: section._id
        });
        break;
      }
    }
  }, [targetContentId, course]);

  const handleCloseOrSelectContent = (content) => {
    setSelectedContent(content);

    if (
      !content &&
      (searchParams.has("contentId") || searchParams.has("commentId"))
    ) {
      setSearchParams({}, { replace: true });
    }
  };

  const enroll = async () => {
    try {
      await api.post(`/courses/${courseId}/enroll`);

      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);

      alert("Matrícula realizada com sucesso!");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao fazer matrícula");
    }
  };

  const handleConfirmLeave = async () => {
    setShowLeaveModal(false);

    try {
      await api.delete(`/courses/${courseId}/enroll`);

      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);

      alert("Você saiu do curso com sucesso!");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao sair do curso");
    }
  };

  const toggleSection = (sectionId) => {
    setOpenSections({
      ...openSections,
      [sectionId]: !openSections[sectionId]
    });
  };

  if (!course) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className="course-details-page">
      <div
      >
        <BackButton/>
      </div>

      <CourseHero course={course} />

      <main className="course-main">
        <CourseInfoCard course={course} />

        {!course.isEnrolled && (
          <section className="course-enroll-card">
            <p>Matricule-se para acessar o conteúdo completo do curso.</p>

            <button onClick={enroll}>Matricular-se</button>
          </section>
        )}

        {course.isEnrolled && (
          <section className="course-sections">
            {[...course.sections]
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <CourseSectionCard
                  key={section._id}
                  section={section}
                  isOpen={openSections[section._id]}
                  toggleSection={toggleSection}
                  setSelectedContent={handleCloseOrSelectContent}
                />
              ))}

            {isStudent && (
              <div style={{ marginTop: "24px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(true)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Sair do curso
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <CourseContentModal
        selectedContent={selectedContent}
        setSelectedContent={handleCloseOrSelectContent}
        courseId={courseId}
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        title="Sair do curso"
        message={`Tem certeza que deseja cancelar sua matrícula em "${course.title}"? Você perderá o acesso às aulas até se matricular novamente.`}
        confirmText="Sim, sair do curso"
        cancelText="Cancelar"
        onConfirm={handleConfirmLeave}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
}