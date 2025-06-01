import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/authSlice";
import { authService } from "../../service/authService";
import styles from "./index.module.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!usuario || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      const res = await authService.login({ usuario, senha });
      dispatch(
        setAuth({
          token: res.token,
          usuario,
          id: res.id,
          perfil: res.perfil,
          nome: res.nome,
        })
      );
      navigate("/");
    } catch (err) {
      const mensagemErro =
        err.response?.data?.message || "Usuário ou senha inválidos.";
      setErro(mensagemErro);
      console.error("Erro ao logar:", err.response?.data || err.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = () => {
    navigate("/cadastro");
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <h2 className={styles.formTitle}>Bem-vindo!</h2>

        <div className={styles.inputGroup}>
          <label>Usuário</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            disabled={carregando}
            placeholder="Digite seu usuário"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={carregando}
            placeholder="Digite sua senha"
            required
          />
        </div>

        {erro && <div className={styles.alertErro}>{erro}</div>}

        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          className={styles.btnSecondary}
          onClick={handleCadastro}
          disabled={carregando}
        >
          Cadastre-se
        </button>
      </form>
    </div>
  );
}
