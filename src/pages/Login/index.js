import { useState } from "react"
import { UsuarioContext, useUsuarioContext } from "../../context/Usuario";

export default function Login() {

  const [usuarioInformado, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useUsuarioContext(UsuarioContext);

  function loginSubmit() {

    if (usuarioInformado === "erick" && senha === "1") {
      login({ nome: usuarioInformado, usuarioInformado, logado: true })
    } else {
      alert("SE-FODEU!");
    }
  }

  <form onSubmit={loginSubmit}>
    <div className="mb-3">
      <label htmlFor="usuario" className="form-label">
        Usuário:
      </label>
      <input
        type="text"
        value={usuarioInformado}
        onChange={(e) => setUsuario(e.target.value)}
        className="form-control"
        id="usuario"
        name="usuario"
        placeholder="Digite seu nome"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="evento" className="form-label">
        Senha:
      </label>
      <input
        type="password"
        value={usuarioInformado}
        onChange={(e) => setSenha(e.target.value)}
        className="form-control"
        id="evento"
        name="evento"
        placeholder="Digite o evento"
      />
    </div>

    <button type="submit" className="btn btn-primary w-100">
      Login
    </button>
  </form>
}