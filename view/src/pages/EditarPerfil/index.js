import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { selectUser, logout } from '../../redux/authSlice'; 
import { usuarioService } from "../../service/usuarioService";
import BuscaEndereco from "../BuscaEndereco";
import Modal from "../../components/Modal";
import styles from './index.module.css';

export default function EditarPerfil() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState({ cep: "", localidade: "", uf: "" });

  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtualEmail, setSenhaAtualEmail] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaNovaSenha, setConfirmaNovaSenha] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [erroTelefone, setErroTelefone] = useState("");
  
  const [modalEmailAberto, setModalEmailAberto] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) {
        navigate("/login");
        return;
    }
    usuarioService.getUsuarioById(currentUser.id)
      .then(dados => {
        setNome(dados.nome || "");
        setSobrenome(dados.sobrenome || "");
        setTelefone(dados.telefone || "");
        setEndereco({ cep: dados.cep || "", localidade: dados.localidade || "", uf: dados.uf || ""});
      })
      .catch(error => {
        console.error("Erro ao carregar dados do usuário:", error);
        alert("Erro ao carregar dados! Você será redirecionado.");
        navigate("/");
      })
      .finally(() => setCarregando(false));
  }, [currentUser?.id, navigate]);

  const validarTelefone = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, "");
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      setErroTelefone("Número inválido. Inclua o DDD.");
    } else {
      setErroTelefone("");
    }
    setTelefone(numero);
  };

  async function handleAtualizarDadosBasicos(e) {
    e.preventDefault();
    if (erroTelefone) {
      setMensagem({ tipo: "erro", texto: "Corrija o número de telefone." });
      return;
    }
    setCarregando(true);
    setMensagem({ tipo: "", texto: "" });
    try {
      const payload = { nome, sobrenome, telefone, cep: endereco.cep, localidade: endereco.localidade, uf: endereco.uf };
      await usuarioService.atualizarPerfil(currentUser.id, payload);
      setMensagem({ tipo: "sucesso", texto: "Dados pessoais atualizados com sucesso!" });
    } catch (error) {
      setMensagem({ tipo: "erro", texto: error.response?.data || "Erro ao atualizar dados." });
    } finally {
      setCarregando(false);
    }
  }

  async function handleAlterarEmail(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: "", texto: "" });
    try {
      const res = await usuarioService.alterarEmail({ novoEmail, senhaAtual: senhaAtualEmail });
      setModalEmailAberto(false);
      setMensagem({ tipo: "sucesso", texto: `${res} Por segurança, você será deslogado.` });
      setTimeout(() => {
          dispatch(logout());
          navigate("/login");
      }, 3000);
    } catch (error) {
      setMensagem({ tipo: "erro", texto: error.response?.data || "Erro ao alterar e-mail." });
    } finally {
      setCarregando(false);
    }
  }

  async function handleAlterarSenha(e) {
    e.preventDefault();
    if (novaSenha !== confirmaNovaSenha) {
        setMensagem({ tipo: "erro", texto: "A nova senha e a confirmação não correspondem." });
        return;
    }
    setCarregando(true);
    setMensagem({ tipo: "", texto: "" });
    try {
      const res = await usuarioService.alterarSenha({ senhaAtual, novaSenha });
      setModalSenhaAberto(false);
      setMensagem({ tipo: "sucesso", texto: `${res} Por segurança, você será deslogado.` });
      setTimeout(() => {
          dispatch(logout());
          navigate("/login");
      }, 3000);
    } catch (error) {
      setMensagem({ tipo: "erro", texto: error.response?.data || "Erro ao alterar senha." });
    } finally {
      setCarregando(false);
    }
  }

  if (carregando && !nome) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div></div>;
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={`card ${styles.formCard}`} style={{ maxWidth: "600px", margin: "auto" }}>
          <h2 className={styles.formTitle}>Editar Perfil</h2>
          <p className={styles.formSubtitle}>Atualize suas informações pessoais.</p>

          {mensagem.texto && (
            <div className={`alert alert-${mensagem.tipo === 'sucesso' ? 'success' : 'danger'} ${styles.message}`}>
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleAtualizarDadosBasicos}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nome</label>
                <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={carregando} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Sobrenome</label>
                <input type="text" className="form-control" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required disabled={carregando} />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Telefone</label>
                <input type="tel" className={`form-control ${erroTelefone ? "is-invalid" : ""}`} value={telefone} onChange={(e) => validarTelefone(e.target.value)} required disabled={carregando} />
                {erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}
              </div>
            </div>
            <BuscaEndereco setEndereco={setEndereco} disabled={carregando} />
            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar Dados Pessoais"}
            </button>
          </form>
          <div className={styles.actionButtonsContainer}>
            <button className="btn btn-secondary" onClick={() => setModalEmailAberto(true)}>Alterar E-mail</button>
            <button className="btn btn-secondary" onClick={() => setModalSenhaAberto(true)}>Alterar Senha</button>
          </div>
          
          <button type="button" className="btn btn-link text-secondary w-100 mt-2" onClick={() => navigate("/")}>
            Voltar
          </button>
        </div>
      </div>

      {modalEmailAberto && (
        <Modal title="Alterar E-mail de Login" onClose={() => setModalEmailAberto(false)}>
          <form onSubmit={handleAlterarEmail}>
            <div className="mb-3">
              <label className="form-label">Novo E-mail</label>
              <input type="email" placeholder="seu.novo@email.com" className="form-control" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} required disabled={carregando} />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha Atual para Confirmar</label>
              <input type="password" placeholder="••••••••" className="form-control" value={senhaAtualEmail} onChange={e => setSenhaAtualEmail(e.target.value)} required disabled={carregando}/>
            </div>
            <button type="submit" className="btn btn-dark w-100" disabled={carregando}>Confirmar Alteração</button>
          </form>
        </Modal>
      )}

      {modalSenhaAberto && (
        <Modal title="Alterar Senha" onClose={() => setModalSenhaAberto(false)}>
          <form onSubmit={handleAlterarSenha}>
            <div className="mb-3">
              <label className="form-label">Senha Atual</label>
              <input type="password" placeholder="••••••••" className="form-control" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} required disabled={carregando}/>
            </div>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label">Nova Senha</label>
                <input type="password" placeholder="Mín. 6 caracteres" className="form-control" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} required disabled={carregando}/>
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirmar Nova Senha</label>
                <input type="password" placeholder="Repita a nova senha" className="form-control" value={confirmaNovaSenha} onChange={e => setConfirmaNovaSenha(e.target.value)} required disabled={carregando}/>
              </div>
            </div>
            <button type="submit" className="btn btn-dark w-100" disabled={carregando}>Confirmar Alteração</button>
          </form>
        </Modal>
      )}
    </>
  );
}