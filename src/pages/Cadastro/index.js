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
  const navigate = useNavigate();

  async function cadastrarUsuario(e) {
    e.preventDefault();
    try {
      if (!usuario || !senha || !endereco.cep || !perfil || !nome || !sobrenome || !telefone) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const novoUsuario = {
        usuario,
        senha,
        perfil,
        endereco,
        nome,
        sobrenome,
        telefone,
      };

      await axios.post("http://localhost:3001/usuario", novoUsuario);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao cadastrar o usuário!");
    }
  }

  return (
    <div className="container text-center py-4">
      <h1 className="fw-bold">Cadastramento de Usuario</h1>
      <form onSubmit={cadastrarUsuario} className="mt-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Usuário</label>
            <input
              type="text"
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Sobrenome</label>
            <input
              type="text"
              className="form-control"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Telefone</label>
            <input
              type="text"
              className="form-control"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Perfil</label>
            <select
              className="form-control"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="a">Administrador</option>
              <option value="m">Médico</option>
              <option value="p">Paciente</option>
            </select>
          </div>
        </div>
        <BuscaEndereco setEndereco={setEndereco} />
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <label className="form-label">UF</label>
            <input
              type="text"
              className="form-control"
              value={endereco.uf || ""}
              onChange={(e) => setEndereco({ ...endereco, uf: e.target.value })}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Localidade</label>
            <input
              type="text"
              className="form-control"
              value={endereco.localidade || ""}
              onChange={(e) => setEndereco({ ...endereco, localidade: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          cadastrar
        </button>
      </form>
      <button
        type="button"
        className="btn btn-secondary mt-3 w-100"
        onClick={() => navigate("/login")}
      >
        Voltar
      </button>
    </div>
  );
}