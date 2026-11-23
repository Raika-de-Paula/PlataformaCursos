// src/pages/PublicProfile.jsx

import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Link2, Check } from "lucide-react";
import api from "../services/api";
import "../styles/PublicProfile.css";

export default function PublicProfile() {
  const { userId } = useParams();
  const location = useLocation();

  const isInstructor = location.pathname.includes("/instructors");

  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const route = isInstructor
          ? `/instructors/${userId}`
          : `/students/${userId}`;

        const response = await api.get(route);
        setProfile(response.data);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar perfil público");
      }
    };

    fetchProfile();
  }, [userId, isInstructor]);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} - Neadro`;
    }
  }, [profile]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      alert("Link do perfil copiado com sucesso!");

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error(error);
      alert("Erro ao copiar o link do perfil");
    }
  };

  if (!profile) {
    return <h1>Carregando...</h1>;
  }

  const courses = isInstructor
    ? profile.courses || []
    : profile.enrolledCourses || [];

  return (
    <main className="public-profile-page">
      <div className="public-profile-banner"></div>

      <div className="public-profile-container">
        <aside className="public-profile-sidebar">
          <section className="public-profile-card main-profile-card">
            {profile.photoUrl ? (
              <img
                className="public-profile-avatar"
                src={profile.photoUrl}
                alt={profile.name}
              />
            ) : (
              <div className="public-profile-avatar empty">
                {profile.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}

            <div className="public-profile-name-row">
              <h1>{profile.name}</h1>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`copy-profile-icon-btn ${copied ? "copied" : ""}`}
                title="Copiar link do perfil"
                aria-label="Copiar link do perfil"
              >
                {copied ? <Check size={16} /> : <Link2 size={16} />}
              </button>
            </div>

            <p className="public-profile-role">
              {isInstructor ? "Instrutor" : "Aluno"}
            </p>

            {profile.contacts?.links?.length > 0 && (
              <div className="public-profile-socials">
                {profile.contacts.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.label}
                  >
                    {link.label?.[0]?.toUpperCase() || "🔗"}
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="public-profile-card">
            <h3>Contatos</h3>

            {profile.contacts?.emails?.map((email, index) => (
              <p key={index}>{email}</p>
            ))}

            {profile.contacts?.phones?.map((phone, index) => (
              <p key={index}>{phone}</p>
            ))}
          </section>

          <section className="public-profile-card">
            <h3>{isInstructor ? "Especialidades" : "Interesses"}</h3>

            <div className="public-profile-tags">
              {(isInstructor ? profile.specialties : profile.interests)?.map(
                (item, index) => (
                  <span key={index}>{item}</span>
                )
              )}
            </div>
          </section>

          {isInstructor && profile.academicBackground?.length > 0 && (
            <section className="public-profile-card">
              <h3>Formação</h3>

              {profile.academicBackground.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </section>
          )}
        </aside>

        <section className="public-profile-content">
          <section className="public-profile-card about-card">
            <h2>Sobre</h2>

            <p>
              {profile.bio || "Nenhuma biografia adicionada."}
            </p>
          </section>

          <div className="public-courses-header">
            <h2>
              {isInstructor ? "Cursos Criados" : "Cursos Matriculados"}
            </h2>

            <span>
              {courses.length} {courses.length === 1 ? "curso" : "cursos"}
            </span>
          </div>

          <div className="public-courses-grid">
            {courses.length === 0 && (
              <p>Nenhum curso encontrado.</p>
            )}

            {courses.map((course) => (
              <article key={course._id} className="public-course-card">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                  />
                ) : (
                  <div className="public-course-placeholder">
                    Capa do Curso
                  </div>
                )}

                <div className="public-course-info">
                  <h3>{course.title}</h3>

                  <p>{course.description}</p>

                  <div className="public-course-footer">
                    <span>{course.category}</span>

                    <Link to={`/courses/${course._id}`}>
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
