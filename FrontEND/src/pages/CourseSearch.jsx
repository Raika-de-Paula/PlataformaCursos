import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { FiUser } from "react-icons/fi";
import "../styles/CourseSearch.css";

export default function CourseSearch() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "";

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");

        // CORREÇÃO: Se 'title' for vazio, exibe a lista completa de cursos da resposta
        const filteredCourses = title.trim()
          ? response.data.filter((course) =>
              course.title
                .toLowerCase()
                .includes(title.toLowerCase())
            )
          : response.data;

        setCourses(filteredCourses);
      } catch (error) {
        console.error(error);
        alert("Erro ao buscar cursos");
      }
    };

    fetchCourses();
  }, [title]);

  return (
    <div className="search-page-container">
      <h1 className="search-page-title">Resultado da busca</h1>

      {/* Condicional dinâmica de texto baseada no termo de busca */}
      <p className="search-query-text">
        {title.trim() ? (
          <>Buscando por: <span>"{title}"</span></>
        ) : (
          <span>Exibindo todos os cursos disponíveis</span>
        )}
      </p>

      {courses.length === 0 && (
        <p className="no-results-text">Nenhum curso encontrado.</p>
      )}

      <div className="courses-search-grid">
        {courses.map((course) => (
          <div key={course._id} className="search-course-card">
            
            <div className="card-image-wrapper">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="search-course-image"
                />
              )}
              {course.category && (
                <span className="card-category-badge">
                  {course.category}
                </span>
              )}
            </div>

            <div className="search-card-content">
              <h2 className="search-course-title">{course.title}</h2>
              
              <div className="search-course-instructor">
                <FiUser size={14} />
                <span>Por {course.instructorName || course.instructor?.name || "Instrutor"}</span>
              </div>

              <p className="search-course-description">
                {course.description}
              </p>

              <div className="search-card-footer">
                <span className={`search-status-badge ${course.status}`}>
                  {course.status === "in_progress" && "Em Progresso"}
                  {course.status === "available" && "Disponível"}
                  {course.status === "finished" && "Concluído"}
                  {course.status !== "in_progress" && course.status !== "available" && course.status !== "finished" && course.status}
                </span>

                <Link to={`/courses/${course._id}`} className="search-view-link">
                  Ver curso
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}