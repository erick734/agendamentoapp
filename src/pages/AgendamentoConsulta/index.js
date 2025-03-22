import React, { useState } from "react";
import axios from "axios";

export default function AgendamentoConsulta() {
  const [horario, setHorario] = useState("");
  const [medico, setMedico] = useState("");
  const [telefone, setTelefone] = useState("");

  async function agendarConsulta(e) {
    e.preventDefault();
    try {
      if (!horario || !medico || !telefone) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const novaConsulta = {
        horario,
        medico,
        telefone,
      };

      await axios.post("http://localhost:3001/consultas", novaConsulta);
      alert("Consulta agendada com sucesso!");
      setHorario("");
      setMedico("");
      setTelefone("");
    } catch (error) {
      alert("Erro ao agendar a consulta!");
    }
  }

  return (
    <div className="container text-center py-4">
      <h1 className="fw-bold">Agendamento de Consulta</h1>
      <p className="fs-4 text-muted mb-0">"Preencha os campos para agendar sua consulta"</p>

      <form onSubmit={agendarConsulta} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Horário</label>
          <input
            type="time"
            className="form-control"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Médico</label>
          <select
            className="form-control"
            value={medico}
            onChange={(e) => setMedico(e.target.value)}
          >
            <option value="">Selecione um médico</option>
            <option value="Dr. João">Dr. João</option>
            <option value="Dra. Maria">Dra. Maria</option>
            <option value="Dr. Carlos">Dr. Carlos</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Telefone</label>
          <input
            type="tel"
            className="form-control"
            placeholder="(99) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3 w-100">
          Agendar Consulta
        </button>
      </form>
    </div>
  );
}
