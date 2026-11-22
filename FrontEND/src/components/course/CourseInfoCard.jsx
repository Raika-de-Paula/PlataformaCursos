import { formatDate } from "./courseUtils";

export default function CourseInfoCard({ course }) {
  const countMaterials = () => {
    return course.sections?.reduce((total, section) => {
      return total + section.contents.length;
    }, 0);
  };

  return (
    <section className="course-info-card">
      <div>
        <span>Instrutor</span>
        <strong>{course.instructorId?.name || "Instrutor"}</strong>
      </div>

      <div>
        <span>Seções</span>
        <strong>{course.sections?.length || 0} seções</strong>
      </div>

      <div>
        <span>Materiais</span>
        <strong>{countMaterials()} itens</strong>
      </div>

      <div>
        <span>Última atualização</span>
        <strong>{formatDate(course.updatedAt)}</strong>
      </div>
    </section>
  );
}