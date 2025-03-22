import React, { useState } from "react";
import axios from "axios";

export default function BuscaEndereco({ setEndereco }) {
  const [cep, setCep] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [uf, setUf] = useState("");

  async function buscarEndereco(e) {
    e.preventDefault();
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        alert("CEP inválido! Tente novamente.");
        return;
      }

      const { localidade, uf } = response.data;
      setLocalidade(localidade || "");
      setUf(uf || "");

      setEndereco(response.data);
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

      <div className="mt-3">
        <label className="form-label">Localidade</label>
        <input
          type="text"
          className="form-control"
          value={localidade}
          onChange={(e) => setLocalidade(e.target.value)}
        />
        <label className="form-label">UF</label>
        <input
          type="text"
          className="form-control"
          value={uf}
          onChange={(e) => setUf(e.target.value)}
        />
      </div>
    </div>
  );
}