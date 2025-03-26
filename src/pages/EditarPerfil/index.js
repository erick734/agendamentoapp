import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../../context/Usuario";
import BuscaEndereco from "../BuscaEndereco";

export default function EditarPerfil() {
  const { usuario } = useContext(UsuarioContext);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [endereco, setEndereco] = useState({});

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setSobrenome(usuario.sobrenome);
      setTelefone(usuario.telefone);
      setEndereco(usuario.endereco || {});
    }
  }, [usuario]);

  const validarTelefone = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (numeroLimpo.length < 8 || numeroLimpo.length > 9) {
      setErroTelefone("Número inválido. Digite 8 ou 9 números.");
    } else if (numeroLimpo.length === 9 && numeroLimpo[0] !== "9") {
      setErroTelefone("Celular deve começar com 9.");
    } else {
      setErroTelefone("");
    }

    setTelefone(numero);
  };

  async function atualizarPerfil(e) {
    e.preventDefault();

    if (!nome || !sobrenome || !telefone || !endereco.cep) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (erroTelefone) {
      alert("Corrija o número de telefone antes de continuar.");
      return;
    }

    try {
      const usuarioAtualizado = { nome, sobrenome, telefone, endereco };

      await axios.patch(`http://localhost:3001/usuario/${usuario.id}`, usuarioAtualizado);
      alert("Perfil atualizado com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao atualizar o perfil!");
    }
  }

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center fw-bold">Editar Perfil</h2>
        <p className="text-muted text-center">Atualize suas informações abaixo.</p>

        <form onSubmit={atualizarPerfil} className="mt-3">
          <div className="mb-3">
            <label className="form-label fw-bold">Nome</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Sobrenome</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Contato</label>
            <input
              type="tel"
              className={`form-control form-control-lg ${erroTelefone ? "is-invalid" : ""}`}
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(e) => validarTelefone(e.target.value)}
            />
            {erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}
          </div>

          <BuscaEndereco setEndereco={setEndereco} />

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">UF</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={endereco.uf || ""}
                onChange={(e) => setEndereco({ ...endereco, uf: e.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Localidade</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={endereco.localidade || ""}
                onChange={(e) => setEndereco({ ...endereco, localidade: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">
            Salvar
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-lg w-100 mt-2"
            onClick={() => navigate("/")}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}
