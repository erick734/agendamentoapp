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
      const responseAxios1 = await axios.get("http://localhost:3001/usuario/?usuario=" + usuarioInformado + "&senha=" + senha)

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

        <label className="text-light">Usuario: </label>
        <input type="text" value={usuarioInformado} onChange={(e) => setUsuarios(e.target.value)} className="form-control"></input>
        <label className="text-light">Senha: </label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="form-control"></input>
        <button type="submit" className="btn btn-primary mt-2 col-md-2 text-center w-100">Entrar</button>
      </div>
    </form>
  )
}