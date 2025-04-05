import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarioContext } from "../../context/Usuario";
import axios from "axios";

export default function Login() {
  const [usuarioInformado, setUsuarioInformado] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { login } = useUsuarioContext();
  const navigate = useNavigate();

  async function loginSubmit(e) {
    e.preventDefault();

    if (!usuarioInformado || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    setCarregando(true);

    try {
      const responseAxios = await axios.get(
        `http://localhost:3001/usuario?usuario=${usuarioInformado}&senha=${senha}`
      );

      if (responseAxios.data.length > 0) {
        const usuario = responseAxios.data[0];
        login({ ...usuario, logado: true });
        navigate("/");
      } else {
        alert("Usuário ou senha incorretos. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao comunicar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={loginSubmit}
        className="p-4 bg-dark text-light rounded shadow-lg"
        style={{ width: "350px", maxWidth: "100%", overflow: "hidden" }}
      >
        <h1 className="text-center fw-bold mb-4">Login</h1>

        <div className="mb-3">
          <label className="form-label">Usuário:</label>
          <input
            type="text"
            className="form-control"
            value={usuarioInformado}
            onChange={(e) => setUsuarioInformado(e.target.value)}
            disabled={carregando}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha:</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={carregando}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          className="btn btn-secondary w-100 mt-2"
          onClick={() => navigate("/cadastro")}
          disabled={carregando}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
