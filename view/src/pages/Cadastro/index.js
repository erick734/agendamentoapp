import React, { useState } from "react";
import axios from "axios";
import BuscaEndereco from "../BuscaEndereco";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("p");
  const [endereco, setEndereco] = useState({});
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const navigate = useNavigate();

  const validarTelefone = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, "");

    if (numeroLimpo.length < 8 || numeroLimpo.length > 9) {
      setErroTelefone("Número inválido. Digite 8 ou 9 números.");
    } else if (numeroLimpo.length === 9 && numeroLimpo[0] !== "9") {
      setErroTelefone("Celular deve começar com 9.");
    } else {
      setErroTelefone("");
    }

    setTelefone(numero);
  };

  async function cadastrarUsuario(e) {
    e.preventDefault();
    if (!usuario || !senha || !endereco.cep || !perfil || !nome || !sobrenome || !telefone) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (erroTelefone) {
      alert("Corrija o número de telefone antes de continuar.");
      return;
    }

    try {
      const novoUsuario = { usuario, senha, perfil, endereco, nome, sobrenome, telefone };
      await axios.post("http://localhost:3001/usuario", novoUsuario);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao cadastrar o usuário!");
    }
  }

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center fw-bold">Cadastro de Usuário</h2>
        <p className="text-muted text-center">Preencha as informações abaixo.</p>

        <form onSubmit={cadastrarUsuario} className="mt-3">
          <div className="mb-3">
            <label className="form-label fw-bold">Usuário</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Senha</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

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
            <label className="form-label fw-bold">Telefone</label>
            <input
              type="tel"
              className={`form-control form-control-lg ${erroTelefone ? "is-invalid" : ""}`}
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(e) => validarTelefone(e.target.value)}
            />
            {erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Perfil</label>
            <select
              className="form-control form-control-lg"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="a">Administrador</option>
              <option value="m">Médico</option>
              <option value="p">Paciente</option>
            </select>
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
            Cadastrar
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-lg w-100 mt-2"
            onClick={() => navigate("/login")}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}