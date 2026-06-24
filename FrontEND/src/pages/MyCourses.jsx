// src/pages/MyCourses.jsx

import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import api from "../services/api";
import "../styles/MyCourses.css";

export default function MyCourses() {
  const { activeRole } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();

  const searchTitle = searchParams.get("title")?.toLowerCase() || "";

  const isInstructor = activeRole === "instructor";

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const route = isInstructor
          ? "/courses/instructor/me"
          : "/students/me/enrollments";

        const response = await api.get(route);

        setItems(response.data);
      } catch {
        alert(
          isInstructor
            ? "Erro ao carregar cursos criados"
            : "Erro ao carregar meus cursos"
        );
      }
    };

    loadCourses();
  }, [isInstructor]);

  const normalizedCourses = items.map((item) => {
    if (isInstructor) {
      return {
        id: item._id,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        status: item.status,
        instructorName: null,
        editUrl: `/instructor/courses/${item._id}/edit`,
        detailsUrl: `/courses/${item._id}`
      };
    }

    return {
      id: item.courseId._id,
      title: item.courseId.title,
      description: item.courseId.description,
      thumbnail: item.courseId.thumbnail,
      status: item.status,
      instructorName: item.courseId.instructorId?.name || "Instrutor",
      editUrl: null,
      detailsUrl: `/courses/${item.courseId._id}`
    };
  });

  const filteredCourses = normalizedCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTitle)
  );

  const getStatusText = (status) => {
    if (status === "in_progress") return "Em andamento";
    if (status === "finished") return "Finalizado";
    if (status === "completed") return "Concluído";

    return status;
  };

  return (
    <div className="my-courses-page">
      <h1>{isInstructor ? "Meus Cursos Criados" : "Meus Cursos"}</h1>

      {searchTitle && (
        <p>
          Resultado da busca por: <strong>{searchTitle}</strong>
        </p>
      )}

      {filteredCourses.length === 0 && !searchTitle && (
        <p>
          {isInstructor
            ? "Você ainda não criou nenhum curso."
            : "Você ainda não está matriculado em nenhum curso."}
        </p>
      )}

      {filteredCourses.length === 0 && searchTitle && (
        <p>Nenhum curso encontrado com esse nome.</p>
      )}

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            {course.thumbnail && (
              <img
                className="course-card-image"
                src={course.thumbnail}
                alt={course.title}
              />
            )}

            <div className="course-card-content">
              <div className="course-card-header">
                <h2>{course.title}</h2>

                <div className="author-info">
                  {!isInstructor && (
                    <span className="author-name">
                      {course.instructorName}
                    </span>
                  )}

                  <span className={`status-badge ${course.status}`}>
                    {getStatusText(course.status)}
                  </span>
                </div>
              </div>

              <p className="course-card-description">
                {course.description}
              </p>

              <div className="course-card-actions">
                <Link className="btn-details" to={course.detailsUrl}>
                  {isInstructor ? "Ver Curso" : "Ver Detalhes"}
                </Link>

                {isInstructor && (
                  <Link
                    className="btn-details btn-edit"
                    to={course.editUrl}
                  >
                    Editar
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}