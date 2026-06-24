//src/components/Auth/RegisterForm.jsx

export default function RegisterForm({
  registerForm,
  handleRegisterChange,
  handleRegisterRoleChange,
  handleRegisterSubmit
}) {
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
        <p>Tipo de conta:</p>

        <div className="roles-row">
          <label className="uiverse-pixel-checkbox">
            <input
              className="uiverse-pixel-checkbox-input"
              type="checkbox"
              checked={registerForm.roles.includes("student")}
              onChange={() => handleRegisterRoleChange("student")}
            />
            <span className="uiverse-pixel-checkbox-label">
              Aluno
            </span>
          </label>

          <label className="uiverse-pixel-checkbox">
            <input
              className="uiverse-pixel-checkbox-input"
              type="checkbox"
              checked={registerForm.roles.includes("instructor")}
              onChange={() => handleRegisterRoleChange("instructor")}
            />
            <span className="uiverse-pixel-checkbox-label">
              Instrutor
            </span>
          </label>
        </div>
      </div>

      <button className="flip-card__btn" type="submit">
        Cadastrar
      </button>
    </form>
  );
}