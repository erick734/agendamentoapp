import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AgendamentoConsulta() {
  const { id } = useParams();
  const [horario, setHorario] = useState("");
  const [medico, setMedico] = useState("");
  const [telefone, setTelefone] = useState("");
  const [medicos, setMedicos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMedicos() {
      const response = await axios.get("http://localhost:3001/usuario?perfil=m");
      setMedicos(response.data);
    }
    fetchMedicos();

    if (id) {
      async function fetchConsulta() {
        const response = await axios.get(`http://localhost:3001/consultas/${id}`);
        const consulta = response.data;
        setHorario(consulta.horario);
        setMedico(consulta.usuarioMedicoId);
        setTelefone(consulta.telefone);
      }
      fetchConsulta();
    }
  }, [id]);

  async function agendarConsulta(e) {
    e.preventDefault();
    try {
      if (!horario || !medico || !telefone) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const novaConsulta = {
        horario,
        usuarioMedicoId: medico,
        telefone,
        confirmada: false,
        cancelada: false,
      };

      if (id) {
        await axios.patch(`http://localhost:3001/consultas/${id}`, novaConsulta);
        alert("Consulta atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:3001/consultas", novaConsulta);
        alert("Consulta agendada com sucesso!");
      }

      navigate("/");
    } catch (error) {
      alert("Erro ao agendar a consulta!");
    }
  }

  return (
    <div className="container text-center py-4">
      <h1 className="fw-bold">{id ? "Editar Consulta" : "Agendamento de Consulta"}</h1>
      <p className="fs-4 text-muted mb-0">Preencha os campos para {id ? "editar" : "agendar"} sua consulta</p>

      <form onSubmit={agendarConsulta} className="mt-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Horário</label>
            <input
              type="time"
              className="form-control"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Telefone</label>
            <input
              type="tel"
              className="form-control"
              placeholder="(99) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label">Médico</label>
            <select
              className="form-control"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
            >
              <option value="">Selecione um médico</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome} {medico.sobrenome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          {id ? "Salvar Alterações" : "Agendar Consulta"}
        </button>
      </form>
    </div>
  );
}