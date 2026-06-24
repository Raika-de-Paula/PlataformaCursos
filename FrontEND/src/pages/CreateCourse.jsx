//src/pages/CreateCouse.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post(
        "/courses",
        form
        );
        console.log(response.data);

        alert("Curso criado com sucesso!");

        navigate(
            `/instructor/courses/${response.data.course._id}/edit`
        );
    } catch (error) {
        alert(
        error.response?.data?.message ||
        "Erro ao criar curso"
        );
      }
    };

  return (
    <div>
      <h1>Criar Curso</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Título do curso"
          value={form.title}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="category"
          placeholder="Categoria"
          value={form.category}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Criar curso
        </button>
      </form>
    </div>
  );
}