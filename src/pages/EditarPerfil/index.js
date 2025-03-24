import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../../context/Usuario";
import BuscaEndereco from "../BuscaEndereco";

export default function EditarPerfil() {
  const { usuario } = useContext(UsuarioContext);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setSobrenome(usuario.sobrenome);
      setTelefone(usuario.telefone);
      setEndereco(usuario.endereco);
    }
  }, [usuario]);

  async function atualizarPerfil(e) {
    e.preventDefault();
    try {
      if (!nome || !sobrenome || !telefone || !endereco.cep) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const usuarioAtualizado = {
        nome,
        sobrenome,
        telefone,
        endereco,
      };

      await axios.patch(`http://localhost:3001/usuario/${usuario.id}`, usuarioAtualizado);
      alert("Perfil atualizado com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao atualizar o perfil!");
    }
  }

  return (
    <div className="container text-center py-4">
      <h1 className="fw-bold">Editar Perfil</h1>
      <form onSubmit={atualizarPerfil} className="mt-4">
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
          Atualizar Perfil
        </button>
      </form>
      <button
        type="button"
        className="btn btn-secondary mt-3 w-100"
        onClick={() => navigate("/")}
      >
        Voltar
      </button>
    </div>
  );
}