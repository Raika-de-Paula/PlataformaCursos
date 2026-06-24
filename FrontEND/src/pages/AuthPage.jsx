import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/authContext";
import "../styles/AuthPage.css";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    selectedRole: "student"
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
    roles: ["student"]
  });

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "").slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, "").slice(0, 11);
    if (value.length <= 2) return value;
    if (value.length <= 3) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length <= 7) return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7)}`;
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    let { name, value } = e.target;
    if (name === "cpf") value = formatCPF(value);
    if (name === "phone") value = formatPhone(value);

    if (name === "birthDate") {
      const year = value.split("-")[0];
      if (year && year.length > 4) return;
    }

    setRegisterForm({
      ...registerForm,
      [name]: value
    });
  };

  const handleRegisterRoleChange = (role) => {
    setRegisterForm((prev) => {
      const hasRole = prev.roles.includes(role);
      return {
        ...prev,
        roles: hasRole
          ? prev.roles.filter((item) => item !== role)
          : [...prev.roles, role]
      };
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: loginForm.email,
        password: loginForm.password
      });

      const loggedUser = response.data.user;
      const authToken = response.data.token;

      if (!loggedUser.roles.includes(loginForm.selectedRole)) {
        alert("Esta conta não possui esse tipo de acesso");
        return;
      }

      login(loggedUser, authToken, loginForm.selectedRole);

      navigate(
        loginForm.selectedRole === "student"
          ? "/my-courses"
          : "/instructor/courses"
      );
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...registerForm,
        cpf: registerForm.cpf.replace(/\D/g, ""),
        phone: registerForm.phone.replace(/\D/g, "")
      };

      await api.post("/auth/register", payload);
      alert("Cadastro realizado com sucesso!");
      setIsRegister(false); 
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao cadastrar");
    }
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        
        {/* Input invisível que controla o estado global do flip e das alturas */}
        <input
          type="checkbox"
          id="auth-toggle"
          className="toggle"
          checked={isRegister}
          onChange={() => setIsRegister(!isRegister)}
        />

        {/* O Switch de abas moderno e arredondado */}
        <label htmlFor="auth-toggle" className="switch">
          <span className="slider"></span>
          <span className="card-side-text left">Entrar</span>
          <span className="card-side-text right">Cadastrar</span>
        </label>

        {/* Container do Card com classes de altura dinâmicas via React */}
        <div className={`flip-card__inner ${isRegister ? "height-register" : "height-login"}`}>
          
          {/* LADO A: Login (Compacto) */}
          <div className="flip-card__front">
            <div className="title">Login</div>
            <LoginForm
              loginForm={loginForm}
              handleLoginChange={handleLoginChange}
              handleLoginSubmit={handleLoginSubmit}
            />
          </div>

          {/* LADO B: Cadastro (Expandido) */}
          <div className="flip-card__back">
            <div className="title">Cadastro</div>
            <RegisterForm
              registerForm={registerForm}
              handleRegisterChange={handleRegisterChange}
              handleRegisterRoleChange={handleRegisterRoleChange}
              handleRegisterSubmit={handleRegisterSubmit}
            />
          </div>

        </div>

      </div>
    </div>
  );
}