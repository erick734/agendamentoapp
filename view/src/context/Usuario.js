import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const UsuarioContext = createContext();

UsuarioContext.displayName = "Usuario";

export default function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [inactiveTime, setInactiveTime] = useState(0);
  const navigate = useNavigate();

  // Reseta o contador de inatividade com eventos de interação
  const resetTimer = useCallback(() => setInactiveTime(0), []);

  useEffect(() => {
    // Adiciona os ouvintes de interação
    const eventHandlers = ["mousemove", "keydown", "scroll"];
    eventHandlers.forEach((event) => window.addEventListener(event, resetTimer));

    // Atualiza o contador de inatividade a cada segundo
    const interval = setInterval(() => {
      setInactiveTime((prev) => prev + 1);
    }, 1000);

    // Limpa os ouvintes e o intervalo ao desmontar
    return () => {
      eventHandlers.forEach((event) => window.removeEventListener(event, resetTimer));
      clearInterval(interval);
    };
  }, [resetTimer]);

  useEffect(() => {
    // Redireciona o usuário após 240 segundos de inatividade
    if (inactiveTime >= 240 && usuario?.logado) {
      navigate("/");
    }

    // Faz logout após 600 segundos de inatividade
    if (inactiveTime >= 600 && usuario?.logado) {
      logout();
      navigate("/login");
    }
  }, [inactiveTime, usuario, navigate]);

  function login(usuarioLogin) {
    setUsuario({ ...usuarioLogin, logado: true });
    setInactiveTime(0); // Reseta tempo de inatividade ao logar
  }

  function logout() {
    setUsuario(null);
    setInactiveTime(0); // Reseta tempo de inatividade ao deslogar
  }

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
}

// Hook personalizado para acessar o contexto
export function useUsuarioContext() {
  const { usuario, login, logout } = useContext(UsuarioContext);

  return {
    usuario,
    login,
    logout,
  };
}