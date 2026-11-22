// src/components/Auth/LoginForm.jsx

export default function LoginForm({
  loginForm,
  handleLoginChange,
  handleLoginSubmit
}) {
  return (
    <form className="flip-card__form" onSubmit={handleLoginSubmit}>
      <input
        className="flip-card__input"
        name="email"
        placeholder="Email"
        type="email"
        value={loginForm.email}
        onChange={handleLoginChange}
      />

      <input
        className="flip-card__input"
        name="password"
        placeholder="Senha"
        type="password"
        value={loginForm.password}
        onChange={handleLoginChange}
      />

      <div className="login-options-group">
        <div className="role-box">
          <span className="role-box__label">Entrar como</span>

          <div className="role-pills">
            <label
              className={`role-pill ${
                loginForm.selectedRole === "student" ? "is-active" : ""
              }`}
            >
              <input
                type="radio"
                name="selectedRole"
                value="student"
                checked={loginForm.selectedRole === "student"}
                onChange={handleLoginChange}
              />
              <span>Aluno</span>
            </label>

            <label
              className={`role-pill ${
                loginForm.selectedRole === "instructor" ? "is-active" : ""
              }`}
            >
              <input
                type="radio"
                name="selectedRole"
                value="instructor"
                checked={loginForm.selectedRole === "instructor"}
                onChange={handleLoginChange}
              />
              <span>Instrutor</span>
            </label>
          </div>
        </div>

        <label className="remember-me-option">
          <input
            type="checkbox"
            name="rememberMe"
            checked={Boolean(loginForm.rememberMe)}
            onChange={handleLoginChange}
          />
          <span>Permanecer conectado</span>
        </label>
      </div>

      <button className="flip-card__btn" type="submit">
        Entrar
      </button>
    </form>
  );
}