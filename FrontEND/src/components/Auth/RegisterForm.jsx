// src/components/Auth/RegisterForm.jsx

export default function RegisterForm({
  registerForm,
  handleRegisterChange,
  handleRegisterRoleChange,
  handleRegisterSubmit
}) {
  const isStudent = registerForm.roles.includes("student");
  const isInstructor = registerForm.roles.includes("instructor");

  return (
    <form className="flip-card__form" onSubmit={handleRegisterSubmit}>
      <input
        className="flip-card__input"
        name="name"
        placeholder="Nome"
        value={registerForm.name}
        onChange={handleRegisterChange}
      />

      <input
        className="flip-card__input"
        name="cpf"
        placeholder="CPF"
        value={registerForm.cpf}
        onChange={handleRegisterChange}
      />

      <input
        className="flip-card__input"
        type="date"
        name="birthDate"
        max={new Date().toISOString().split("T")[0]}
        value={registerForm.birthDate}
        onChange={handleRegisterChange}
      />

      <input
        className="flip-card__input"
        name="phone"
        placeholder="Telefone"
        value={registerForm.phone}
        onChange={handleRegisterChange}
      />

      <input
        className="flip-card__input"
        type="email"
        name="email"
        placeholder="Email"
        value={registerForm.email}
        onChange={handleRegisterChange}
      />

      <input
        className="flip-card__input"
        type="password"
        name="password"
        placeholder="Senha"
        value={registerForm.password}
        onChange={handleRegisterChange}
      />

      <div className="role-box">
        <span className="role-box__label">Tipo de conta</span>

        <div className="role-pills">
          <label className={`role-pill ${isStudent ? "is-active" : ""}`}>
            <input
              type="checkbox"
              checked={isStudent}
              onChange={() => handleRegisterRoleChange("student")}
            />
            <span>Aluno</span>
          </label>

          <label className={`role-pill ${isInstructor ? "is-active" : ""}`}>
            <input
              type="checkbox"
              checked={isInstructor}
              onChange={() => handleRegisterRoleChange("instructor")}
            />
            <span>Instrutor</span>
          </label>
        </div>
      </div>

      <button className="flip-card__btn" type="submit">
        Cadastrar
      </button>
    </form>
  );
}