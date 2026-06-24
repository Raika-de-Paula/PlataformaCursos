//src/components/Auth/LoginForm.jsx

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

      <div className="role-box">
        <p>Entrar como:</p>

        <div className="uiverse-pixel-radio-group">
          <label className="uiverse-pixel-radio">
            <input
              type="radio"
              name="selectedRole"
              value="student"
              checked={loginForm.selectedRole === "student"}
              onChange={handleLoginChange}
            />
            <span>Aluno</span>
          </label>

          <label className="uiverse-pixel-radio">
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

      <button className="flip-card__btn" type="submit">
        Entrar
      </button>
    </form>
  );
}