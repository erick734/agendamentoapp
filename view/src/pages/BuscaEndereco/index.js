import React, { useState } from "react";
import axios from "axios";

export default function BuscaEndereco({ setEndereco }) {
  const [cep, setCep] = useState("");

  async function buscarEndereco(e) {
    e.preventDefault();
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        alert("CEP inválido! Tente novamente.");
        return;
      }

      const { localidade, uf } = response.data;
      setEndereco({ cep, localidade, uf });
    } catch (error) {
      alert("Erro ao buscar o endereço!");
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">CEP</label>
      <input
        type="text"
        className="form-control"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
      />
      <button type="button" onClick={buscarEndereco} className="btn btn-secondary mt-2">
        Buscar Endereço
      </button>
    </div>
  );
}