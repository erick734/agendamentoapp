import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UsuarioContext = createContext();

UsuarioContext.displayName = "Usuario";

export default function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [inactiveTime, setInactiveTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const resetTimer = () => setInactiveTime(0);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    const interval = setInterval(() => {
      setInactiveTime((prev) => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (inactiveTime === 240 && usuario?.logado) {
      navigate("/");
    }

    if (inactiveTime === 600 && usuario?.logado) {
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
  const { usuario, setUsuario, login, logout } = useContext(UsuarioContext);

  return {
    usuario,
    login,
    logout,
  };
}