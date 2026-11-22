import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiFileText, FiTag } from "react-icons/fi";
import api from "../services/api";
import "../styles/CreateCourse.css";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Digite o título do curso");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/courses", form);

      alert("Curso criado com sucesso!");

      navigate(`/instructor/courses/${response.data.course._id}/edit`);
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao criar curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-course-page">
      <section className="create-course-container">
        <button
          type="button"
          className="create-course-back"
          onClick={() => navigate("/instructor/courses")}
        >
          <FiArrowLeft />
          Voltar
        </button>

        <div className="create-course-card">
          <div className="create-course-header">
            <span className="create-course-icon">
              <FiBookOpen />
            </span>

            <div>
              <p className="create-course-subtitle">Área do instrutor</p>
              <h1>Criar novo curso</h1>
              <p className="create-course-text">
                Comece criando as informações principais. Depois você poderá
                adicionar seções, conteúdos e materiais.
              </p>
            </div>
          </div>

          <form className="create-course-form" onSubmit={handleSubmit}>
            <label className="create-course-field">
              <span>Título do curso</span>
              <div className="create-course-input-box">
                <FiBookOpen />
                <input
                  name="title"
                  placeholder="Ex: Introdução ao JavaScript"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="create-course-field">
              <span>Categoria</span>
              <div className="create-course-input-box">
                <FiTag />
                <input
                  name="category"
                  placeholder="Ex: Programação, Design, Banco de Dados"
                  value={form.category}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="create-course-field">
              <span>Descrição</span>
              <div className="create-course-textarea-box">
                <FiFileText />
                <textarea
                  name="description"
                  placeholder="Descreva o objetivo do curso, o que o aluno irá aprender e para quem ele é indicado."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </label>

            <button
              type="submit"
              className="create-course-submit"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar curso"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}