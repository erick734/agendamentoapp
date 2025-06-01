import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { selectId } from '../../redux/authSlice';
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../service/usuarioService";
import BuscaEndereco from "../BuscaEndereco";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const idUsuario = useSelector(selectId);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [endereco, setEndereco] = useState({ cep: "", localidade: "", uf: "" });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!idUsuario) return;

    async function buscarDados() {
      setCarregando(true);
      try {
        const dados = await usuarioService.getUsuarioById(idUsuario);

        setNome(dados.nome || "");
        setSobrenome(dados.sobrenome || "");
        setTelefone(dados.telefone || "");
        setEndereco({
          cep: dados.cep || "",
          localidade: dados.localidade || "",
          uf: dados.uf || "",
        });

      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        alert("Erro ao carregar dados do usuário! Você será redirecionado.");
        navigate("/");
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, [idUsuario, navigate]);

  const validarTelefone = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, "");
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      setErroTelefone("Número inválido. Inclua o DDD e 8 ou 9 dígitos.");
    } else {
      setErroTelefone("");
    }
    setTelefone(numero);
  };

  async function atualizarPerfil(e) {
    e.preventDefault();

    if (erroTelefone) {
      alert("Corrija o número de telefone antes de continuar.");
      return;
    }

    setCarregando(true);
    try {
      const payload = {
        nome,
        sobrenome,
        telefone,
        cep: endereco.cep,
        localidade: endereco.localidade,
        uf: endereco.uf
      };

      await usuarioService.atualizarPerfil(idUsuario, payload);

      alert("Perfil atualizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      alert(error.response?.data?.message || "Erro ao atualizar o perfil!");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4 w-100 mx-auto" style={{ maxWidth: "700px" }}>
        <h2 className="text-center fw-bold">Editar Perfil</h2>
        <p className="text-muted text-center">Atualize suas informações abaixo.</p>

        <form onSubmit={atualizarPerfil} className="mt-3">
          <div className="mb-3">
            <label className="form-label fw-bold">Nome</label>
            <input type="text" className="form-control form-control-lg" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={carregando} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Sobrenome</label>
            <input type="text" className="form-control form-control-lg" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required disabled={carregando} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Contato</label>
            <input type="tel" className={`form-control form-control-lg ${erroTelefone ? "is-invalid" : ""}`} value={telefone} onChange={(e) => validarTelefone(e.target.value)} required disabled={carregando} />
            {erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}
          </div>

          <BuscaEndereco setEndereco={setEndereco} disabled={carregando} />

          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label fw-bold">Localidade</label>
              <input type="text" className="form-control form-control-lg" value={endereco.localidade || ""} readOnly disabled />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">UF</label>
              <input type="text" className="form-control form-control-lg" value={endereco.uf || ""} readOnly disabled />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 mt-3" disabled={carregando || !!erroTelefone}>
            {carregando ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button type="button" className="btn btn-outline-secondary btn-lg w-100 mt-2" onClick={() => navigate("/")} disabled={carregando}>
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}