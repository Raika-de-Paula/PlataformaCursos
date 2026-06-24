//src/pages/Login.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { AuthContext } from "../contexts/authContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedRole, setSelectedRole] = useState("student");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const loggedUser = response.data.user;
      const authToken = response.data.token;

      if (!loggedUser.roles.includes(selectedRole)) {
        alert("Esta conta não possui esse tipo de acesso");
        return;
      }

      login(loggedUser, authToken, selectedRole);

      if (selectedRole === "student") {
        navigate("/my-courses");
      } else {
        navigate("/instructor/courses");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Erro ao fazer login"
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br /><br />

        <p>Entrar como:</p>

        <label>
          <input
            type="radio"
            name="role"
            value="student"
            checked={selectedRole === "student"}
            onChange={(e) =>
              setSelectedRole(e.target.value)
            }
          />
          Aluno
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="role"
            value="instructor"
            checked={selectedRole === "instructor"}
            onChange={(e) =>
              setSelectedRole(e.target.value)
            }
          />
          Instrutor
        </label>

        <br /><br />

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}