// src/contexts/AuthContext.jsx
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContext";

const INACTIVITY_MS = 1000 * 60 * 60 * 3; // 3 horas sem mexer na página (apenas quando NÃO marcou "Permanecer conectado")

function getActiveStorage() {
  if (sessionStorage.getItem("token")) return sessionStorage;
  if (localStorage.getItem("token")) return localStorage;
  return null;
}

function getInitialUser() {
  const storage = getActiveStorage();
  if (!storage) return null;

  try {
    return JSON.parse(storage.getItem("user"));
  } catch {
    return null;
  }
}

function getInitialRole() {
  const storage = getActiveStorage();
  if (!storage) return null;
  return storage.getItem("activeRole");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [activeRole, setActiveRole] = useState(getInitialRole);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("activeRole");
    sessionStorage.clear();

    setUser(null);
    setActiveRole(null);
  }, []);

  const login = (userData, token, role, rememberMe = false) => {
    logout();

    const targetStorage = rememberMe ? localStorage : sessionStorage;

    targetStorage.setItem("user", JSON.stringify(userData));
    targetStorage.setItem("token", token);
    targetStorage.setItem("activeRole", role);

    setUser(userData);
    setActiveRole(role);
  };

  /* === Atualiza os dados do usuário globalmente no storage ativo === */
  const updateUser = (newUserData) => {
    const targetStorage = getActiveStorage() || localStorage;
    targetStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  /* === Logout por inatividade (3 horas) apenas para sessões temporárias (sessionStorage) === */
  useEffect(() => {
    if (!user) return;

    // Se estiver no localStorage ("Permanecer conectado"), não desloga por inatividade
    if (localStorage.getItem("token")) return;

    let timeout;

    const logoutByInactivity = () => {
      logout();
      window.location.href = "/login";
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutByInactivity, INACTIVITY_MS);
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
  }, [user, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        login,
        logout,
        setActiveRole,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}