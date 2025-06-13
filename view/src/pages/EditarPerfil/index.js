import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { selectUser, logout } from '../../redux/authSlice'; 
import { usuarioService } from "../../service/usuarioService";
import BuscaEndereco from "../BuscaEndereco";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
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
  const [submetendo, setSubmetendo] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [modalEmailAberto, setModalEmailAberto] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);

  const mostrarMensagem = (texto, tipo) => {
    setMensagem(texto);
    setTipoMensagem(tipo);
  };

    const handleVoltar = () => {
    if (currentUser?.perfil === 'a') {
      navigate('/admin/empresas');
    } else {
      navigate('/');
    }
  };

  const carregarDadosUsuario = useCallback(() => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }
    setCarregando(true);
    usuarioService.getUsuarioById(currentUser.id)
      .then(dados => {
        setNome(dados.nome || "");
        setSobrenome(dados.sobrenome || "");
        
        const telefoneDoBanco = dados.telefone || "";
        const cepDoBanco = dados.cep || "";
        
        setTelefone(telefoneDoBanco.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'));
        setEndereco({ 
            cep: cepDoBanco.replace(/(\d{5})(\d{3})/, '$1-$2'), 
            localidade: dados.localidade || "", 
            uf: dados.uf || ""
        });
      })
      .catch(error => mostrarMensagem("Erro ao carregar seus dados.", "erro"))
      .finally(() => setCarregando(false));
  }, [currentUser?.id, navigate]);

  useEffect(() => {
    carregarDadosUsuario();
  }, [carregarDadosUsuario]);

  const handleTelefoneChange = (e) => {
    const valor = e.target.value.replace(/\D/g, "");
    const mascarado = valor
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    setTelefone(mascarado);
    
    if (valor.length > 0 && valor.length < 10) {
      setErroTelefone("Número inválido.");
    } else {
      setErroTelefone("");
    }
  };

  async function handleAtualizarDadosBasicos(e) {
    e.preventDefault();
    if (erroTelefone) {
      mostrarMensagem("Corrija o número de telefone.", "erro");
      return;
    }
    setSubmetendo(true);
    try {
      const payload = { 
        nome, 
        sobrenome, 
        telefone: telefone.replace(/\D/g, ""),
        cep: endereco.cep.replace(/\D/g, ""),
        localidade: endereco.localidade, 
        uf: endereco.uf 
      };
      await usuarioService.atualizarPerfil(currentUser.id, payload);
      mostrarMensagem("Dados pessoais atualizados com sucesso!", "sucesso");
    } catch (error) {
      mostrarMensagem(error.response?.data || "Erro ao atualizar dados.", "erro");
    } finally {
      setSubmetendo(false);
    }
  }

  async function handleAlterarEmail(e) {
    e.preventDefault();
    setSubmetendo(true);
    try {
        const res = await usuarioService.alterarEmail({ novoEmail, senhaAtual: senhaAtualEmail });
        setModalEmailAberto(false);
        mostrarMensagem(`${res} Por segurança, você será deslogado.`, "sucesso");
        setTimeout(() => { dispatch(logout()); navigate("/login"); }, 4000);
    } catch (error) {
        alert(error.response?.data || "Erro ao alterar e-mail.");
    } finally {
        setSubmetendo(false);
    }
  }

  async function handleAlterarSenha(e) {
    e.preventDefault();
    if (novaSenha !== confirmaNovaSenha) {
        alert("A nova senha e a confirmação não correspondem.");
        return;
    }
    setSubmetendo(true);
    try {
        const res = await usuarioService.alterarSenha({ senhaAtual, novaSenha });
        setModalSenhaAberto(false);
        mostrarMensagem(`${res} Por segurança, você será deslogado.`, "sucesso");
        setTimeout(() => { dispatch(logout()); navigate("/login"); }, 4000);
    } catch (error) {
        alert(error.response?.data || "Erro ao alterar senha.");
    } finally {
        setSubmetendo(false);
    }
  }
  
  if (carregando) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div></div>;
  }

  return (
    <>
      <Toast message={mensagem} type={tipoMensagem} onClear={() => setMensagem("")} />
      
      <div className={styles.pageContainer}>
        <div className={`card ${styles.formCard}`}>
          
          <div className={styles.cardHeader}>
             <i className={`bi bi-person-circle ${styles.userIcon}`}></i>
             <h2 className={styles.formTitle}>{nome} {sobrenome}</h2>
             <p className={styles.formSubtitle}>Gerencie suas informações pessoais e de segurança</p>
          </div>

          <form onSubmit={handleAtualizarDadosBasicos}>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Nome</label><input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={submetendo} /></div>
              <div className="col-md-6"><label className="form-label">Sobrenome</label><input type="text" className="form-control" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required disabled={submetendo} /></div>
              <div className="col-12"><label className="form-label">Telefone</label><input type="tel" className={`form-control ${erroTelefone ? "is-invalid" : ""}`} value={telefone} onChange={handleTelefoneChange} required disabled={submetendo} />{erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}</div>
            </div>
            
            <div className="mt-3">
                <BuscaEndereco setEndereco={setEndereco} endereco={endereco} disabled={submetendo} />
            </div>

            <div className="row g-3 mt-1">
                <div className="col-md-4">
                    <label className="form-label">CEP</label>
                    <input type="text" className="form-control" value={endereco.cep || ""} readOnly disabled />
                </div>
                <div className="col-md-5">
                    <label className="form-label">Cidade</label>
                    <input type="text" className="form-control" value={endereco.localidade || ""} readOnly disabled />
                </div>
                <div className="col-md-3">
                    <label className="form-label">UF</label>
                    <input type="text" className="form-control" value={endereco.uf || ""} readOnly disabled />
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={submetendo}>{submetendo ? "Salvando..." : "Salvar Dados Pessoais"}</button>
          </form>

          <div className={styles.actionsContainer}>
            <button className="btn btn-secondary" onClick={() => setModalEmailAberto(true)} disabled={submetendo}><i className="bi bi-envelope-at me-2"></i>Alterar E-mail</button>
            <button className="btn btn-secondary" onClick={() => setModalSenhaAberto(true)} disabled={submetendo}><i className="bi bi-key me-2"></i>Alterar Senha</button>
          </div>
          
          <div className="text-center mt-3">
            <button className={styles.backButton} onClick={handleVoltar}>
                <i className="bi bi-arrow-left-circle me-1"></i>
                <span>Voltar</span>
            </button>
          </div>
        </div>
      </div>

      {modalEmailAberto && (
        <Modal title="Alterar E-mail" onClose={() => setModalEmailAberto(false)}>
          <form onSubmit={handleAlterarEmail} className="py-2">
            <p className="text-muted small mb-3">Para sua segurança, ao alterar seu e-mail, você será desconectado.</p>
            <div className="mb-3"><label className="form-label">Novo E-mail</label><input type="email" placeholder="seu.novo@email.com" className="form-control" value={novoEmail} onChange={e => setNovoEmail(e.target.value)} required disabled={submetendo} /></div>
            <div className="mb-3"><label className="form-label">Senha Atual para Confirmar</label><input type="password" placeholder="••••••••" className="form-control" value={senhaAtualEmail} onChange={e => setSenhaAtualEmail(e.target.value)} required autoComplete="current-password" disabled={submetendo}/></div>
            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-dark" disabled={submetendo}>{submetendo ? 'Alterando...' : 'Confirmar Alteração'}</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalEmailAberto(false)}>Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {modalSenhaAberto && (
        <Modal title="Alterar Senha" onClose={() => setModalSenhaAberto(false)}>
          <form onSubmit={handleAlterarSenha} className="py-2">
             <p className="text-muted small mb-3">Para sua segurança, ao alterar sua senha, você será desconectado.</p>
            <div className="mb-3"><label className="form-label">Senha Atual</label><input type="password" placeholder="••••••••" className="form-control" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} required autoComplete="current-password" disabled={submetendo}/></div>
            <div className="row g-2 mb-3">
              <div className="col-md-6"><label className="form-label">Nova Senha</label><input type="password" placeholder="Mín. 6 caracteres" className="form-control" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} required autoComplete="new-password" disabled={submetendo}/></div>
               <div className="col-md-6"><label className="form-label">Confirmar Nova Senha</label><input type="password" placeholder="Repita a nova senha" className="form-control" value={confirmaNovaSenha} onChange={e => setConfirmaNovaSenha(e.target.value)} required autoComplete="new-password" disabled={submetendo}/></div>
            </div>
            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-dark" disabled={submetendo}>{submetendo ? 'Alterando...' : 'Confirmar Alteração'}</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalSenhaAberto(false)}>Cancelar</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}