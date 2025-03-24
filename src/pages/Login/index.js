import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarioContext } from "../../context/Usuario";
import axios from "axios";

export default function Login() {
  const [usuarioInformado, setUsuarios] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useUsuarioContext();
  const navigate = useNavigate();

  async function loginSubmit(e) {
    e.preventDefault();

    // Verificação para garantir que os campos de usuário e senha estão preenchidos
    if (!usuarioInformado || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      const responseAxios = await axios.get(`http://localhost:3001/usuario?usuario=${usuarioInformado}&senha=${senha}`);
      if (responseAxios.data.length > 0) {
        const usuario = responseAxios.data[0];
        login({ ...usuario, logado: true });
        navigate("/");
      } else {
        alert("Usuário ou senha incorretos. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao comunicar com o servidor");
    }
  }

  return (
    <form onSubmit={loginSubmit}>
      <h1 className="text-center fw-bold mt-2">Login</h1>
      <div className="container mt-5 bg-dark pb-5">
        <label className="text-light">Usuário:</label>
        <input
          type="text"
          className="form-control"
          value={usuarioInformado}
          onChange={(e) => setUsuarios(e.target.value)}
        />
        <label className="text-light">Senha:</label>
        <input
          type="password"
          className="form-control"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-2 col-md-2 text-center w-100">Entrar</button>
        <button
          type="button"
          className="btn btn-secondary mt-2 col-md-2 text-center w-100"
          onClick={() => navigate("/cadastro")}
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}