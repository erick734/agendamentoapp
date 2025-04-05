import React, { useContext } from "react";
import { UsuarioContext } from "../../context/Usuario";

export default function Home() {
  const { usuario } = useContext(UsuarioContext);

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center vh-100 text-center py-4">
      <h1 className="fw-bold">Bem-vindo, {usuario?.nome || "Usuário"}!</h1>
      <p className="fs-4 text-muted mb-0">Esta é a página inicial do seu aplicativo.</p>
    </div>
  );
}
