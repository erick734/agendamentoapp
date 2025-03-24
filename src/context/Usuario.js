import { createContext, useContext, useState } from "react";

export const UsuarioContext = createContext();

UsuarioContext.displayName = "Usuario";

export default function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuarioContext() {
  const { usuario, setUsuario } = useContext(UsuarioContext);

  function login(usuarioLogin) {
    setUsuario({ ...usuarioLogin, logado: true });
  }

  function logout() {
    setUsuario(null);
  }

  return {
    usuario,
    login,
    logout
  };
}