//src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        cpf: "",
        birthDate: "",
        phone: "",
        email: "",
        password: "",
        roles: ["student"]
    });

    const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cpf") {
        value = formatCPF(value);
    }

    if (name === "phone") {
        value = formatPhone(value);
    }

    if (name === "birthDate") {
        const year = value.split("-")[0];

        if (year && year.length > 4) {
        return;
        }
    }

    setForm({
        ...form,
        [name]: value
    });
    };

    const handleRoleChange = (role) => {
        setForm((prev) => {
        const hasRole = prev.roles.includes(role);

        return {
            ...prev,
            roles: hasRole
            ? prev.roles.filter((item) => item !== role)
            : [...prev.roles, role]
        };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const payload = {
          ...form,
          cpf: form.cpf.replace(/\D/g, ""),
          phone: form.phone.replace(/\D/g, "")
        };

        await api.post("/auth/register", payload);

        alert("Cadastro realizado com sucesso!");
        navigate("/login");
        } catch (error) {
        alert(
            error.response?.data?.message ||
            "Erro ao cadastrar"
        );
        }
    };

    const formatCPF = (value) => {
    value = value.replace(/\D/g, "");

    value = value.slice(0,11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
    };

    const formatPhone = (value) => {
    value = value.replace(/\D/g, "");

    value = value.slice(0, 11);

    if (value.length <= 2) {
        return value;
    }

    if (value.length <= 3) {
        return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }

    if (value.length <= 7) {
        return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3)}`;
    }

    return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`;
    };

  return (
    <div>
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="date"
          name="birthDate"
          max={new Date().toISOString().split("T")[0]}
          value={form.birthDate}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
        />

        <br /><br />

        <label>
          <input
            type="checkbox"
            checked={form.roles.includes("student")}
            onChange={() => handleRoleChange("student")}
          />
          Aluno
        </label>

        <br />

        <label>
          <input
            type="checkbox"
            checked={form.roles.includes("instructor")}
            onChange={() => handleRoleChange("instructor")}
          />
          Instrutor
        </label>

        <br /><br />

        <button type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}