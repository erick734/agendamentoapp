import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const UsuarioContext = createContext();

UsuarioContext.displayName = "Usuario";

export default function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [inactiveTime, setInactiveTime] = useState(0);
  const navigate = useNavigate();

  const resetTimer = useCallback(() => setInactiveTime(0), []);

  useEffect(() => {
    const eventHandlers = ["mousemove", "keydown", "scroll"];
    eventHandlers.forEach((event) => window.addEventListener(event, resetTimer));

    const interval = setInterval(() => {
      setInactiveTime((prev) => prev + 1);
    }, 1000);

    return () => {
      eventHandlers.forEach((event) => window.removeEventListener(event, resetTimer));
      clearInterval(interval);
    };
  }, [resetTimer]);

  useEffect(() => {
    if (inactiveTime >= 240 && usuario?.logado) {
      navigate("/");
    }

    if (inactiveTime >= 600 && usuario?.logado) {
      logout();
      navigate("/login");
    }
  }, [inactiveTime, usuario, navigate]);

  function login(usuarioLogin) {
    setUsuario({ ...usuarioLogin, logado: true });
    setInactiveTime(0);
  }

  function logout() {
    setUsuario(null);
    setInactiveTime(0);
  }

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuarioContext() {
  const { usuario, login, logout } = useContext(UsuarioContext);

  return {
    usuario,
    login,
    logout,
  };
}