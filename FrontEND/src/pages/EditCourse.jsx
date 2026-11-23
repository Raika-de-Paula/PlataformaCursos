// src/pages/EditCourse.jsx
import { useParams } from "react-router-dom";
import useCourse from "../hooks/useCourse";
import useSections from "../hooks/useSections";
import useContents from "../hooks/useContents";
import CourseForm from "../components/CourseEditor/CourseForm";
import EditCourseHeader from "../components/CourseEditor/EditCourseHeader";
import SectionsCard from "../components/CourseEditor/SectionsCard";
import ConfirmModal from "../components/ConfirmModal";
import BackButton from "../components/BackButton";
import "../styles/EditCourse.css";

export default function EditCourse() {
  const { courseId } = useParams();

  const courseState = useCourse(courseId);
  const { course, setCourse } = courseState;

  const sections = useSections(courseId, course, setCourse);
  const contents = useContents(courseId, course, setCourse);

  if (!course) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className="edit-course-page">
      <BackButton fallback="/instructor/courses" />

      <EditCourseHeader
        status={course.status}
        onDeleteClick={() => courseState.setShowDeleteModal(true)}
      />

      <div className="edit-course-grid">
        <CourseForm
          courseForm={courseState.courseForm}
          handleCourseChange={courseState.handleCourseChange}
          updateCourseInfo={courseState.updateCourseInfo}
          handleThumbnailChange={courseState.handleThumbnailChange}
          thumbnailPreview={courseState.thumbnailPreview}
          currentThumbnail={course.thumbnail}
        />

        <SectionsCard course={course} sections={sections} contents={contents} />
      </div>

      <ConfirmModal
        isOpen={courseState.showDeleteModal}
        title="Excluir curso"
        message={`Tem certeza que deseja excluir o curso "${course.title}" permanentemente? Todas as sessões e materiais serão apagados e esta ação não poderá ser desfeita.`}
        confirmText="Sim, excluir curso"
        cancelText="Cancelar"
        onConfirm={courseState.confirmDeleteCourse}
        onCancel={() => courseState.setShowDeleteModal(false)}
      />
    </div>
  );
}