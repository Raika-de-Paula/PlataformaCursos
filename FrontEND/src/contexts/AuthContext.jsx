// src/contexts/AuthContext.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [activeRole, setActiveRole] = useState(
    localStorage.getItem("activeRole")
  );

  const login = (userData, token, role) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("activeRole", role);

    setUser(userData);
    setActiveRole(role);
  };

  /* === NOVA FUNÇÃO: Atualiza os dados do usuário globalmente === */
  const updateUser = (newUserData) => {
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setActiveRole(null);
  };

  useEffect(() => {
    if (!user) return;

    let timeout;

    const logoutByInactivity = () => {
      logout();
      window.location.href = "/login";
    };

    const resetTimer = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        logoutByInactivity();
      }, 1000 * 60 * 60 * 3); // 3 horas
    };

    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart"
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        login,
        logout,
        setActiveRole,
        updateUser /* <-- Exportando a nova função aqui */
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}