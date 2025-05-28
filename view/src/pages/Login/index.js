import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/authSlice";
import { authService } from "../../service/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    setCarregando(true);

    try {
      const res = await authService.login({ email, senha });

      if (res.token) {
        dispatch(setAuth({ token: res.token, usuario: res.usuario, id: res.id }));
        alert("Login realizado com sucesso!");
        navigate("/");
      } else {
        alert("Token não retornado. Verifique as credenciais.");
      }
    } catch (err) {
      console.error("Erro ao logar:", err.response?.data || err.message);
      alert("Erro ao logar. Verifique os dados ou o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-dark text-light rounded shadow-lg"
        style={{ width: "350px", maxWidth: "100%" }}
      >
        <h2 className="text-center mb-4 fw-bold">Login</h2>

        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={carregando}
          />
        </div>

        <div className="mb-3">
          <label>Senha:</label>
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

        <Link to="/cadastro" className="btn btn-secondary w-100 mt-2">
          Cadastrar
        </Link>
      </form>
    </div>
  );
}