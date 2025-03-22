import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { UsuarioContext, useUsuarioContext } from "../../context/Usuario";
import { Alert } from "bootstrap";

import axios from "axios";

export default function Login() {

  const [usuarioInformado, setUsuarios] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useUsuarioContext(UsuarioContext);
  const navigate = useNavigate();

  async function loginSubmit(e) {
    e.preventDefault();

    try {

      debugger;
      const responseAxios1 = await axios.get("http://localhost:3001/usuario?usuario="+usuarioInformado+ "&senha="+senha)

      if (responseAxios1.data.length > 0) {
        login({ nome: usuarioInformado, usuarioInformado, logado: true })
        navigate("/")
      } else {
        alert("TENTE NOVAMENTE")
      }

    } catch (error) {
      alert("Erro ao comunicar com o servidor")
    }
  }

  return (
    <form onSubmit={loginSubmit}>
      <h1 className="text-center fw-bold mt-2">Login</h1>
      <div className="container mt-5 bg-dark pb-5">
        <label className="text-light">Usuário:</label>
        <input type="text" className="form-control" />
        <label className="text-light">Senha:</label>
        <input type="password" className="form-control" />
        <button type="submit" className="btn btn-primary mt-2 col-md-2 text-center w-100">Entrar</button>
        <button
          type="button"
          className="btn btn-secondary mt-2 col-md-2 text-center w-100"
          onClick={() => navigate("/cadastro")}
        >
          cadastrar
        </button>
      </div>
    </form>
  )
}