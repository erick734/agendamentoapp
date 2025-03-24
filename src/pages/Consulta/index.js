import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UsuarioContext } from "../../context/Usuario";
import { useNavigate } from "react-router-dom";

export default function Consulta() {
  const { usuario } = useContext(UsuarioContext);
  const [consultas, setConsultas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConsultas() {
      let url = "http://localhost:3001/consultas";
      if (usuario.perfil === "m") {
        url += `?usuarioMedicoId=${usuario.id}`;
      } else if (usuario.perfil === "p") {
        url += `?usuarioPacienteId=${usuario.id}`;
      }
      try {
        const response = await axios.get(url);
        const consultasComDetalhes = await Promise.all(
          response.data.map(async (consulta) => {
            try {
              const medicoResponse = await axios.get(`http://localhost:3001/usuario/${consulta.usuarioMedicoId}`);
              const pacienteResponse = await axios.get(`http://localhost:3001/usuario/${consulta.usuarioPacienteId}`);
              return {
                ...consulta,
                nomeMedico: medicoResponse.data.nome ? `${medicoResponse.data.nome} ${medicoResponse.data.sobrenome}` : 'N/A',
                nomePaciente: pacienteResponse.data.nome ? `${pacienteResponse.data.nome} ${pacienteResponse.data.sobrenome}` : 'N/A',
              };
            } catch (error) {
              console.error("Erro ao buscar detalhes do médico ou paciente:", error);
              return {
                ...consulta,
                nomeMedico: 'N/A',
                nomePaciente: 'N/A',
              };
            }
          })
        );
        setConsultas(consultasComDetalhes);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
      }
    }
    fetchConsultas();
  }, [usuario]);

  async function confirmarConsulta(id) {
    try {
      await axios.patch(`http://localhost:3001/consultas/${id}`, { confirmada: true, cancelada: false });
      setConsultas(consultas.map(consulta => consulta.id === id ? { ...consulta, confirmada: true, cancelada: false } : consulta));
    } catch (error) {
      alert("Erro ao confirmar a consulta!");
    }
  }

  async function cancelarConsulta(id) {
    try {
      await axios.patch(`http://localhost:3001/consultas/${id}`, { cancelada: true, confirmada: false });
      setConsultas(consultas.map(consulta => consulta.id === id ? { ...consulta, cancelada: true, confirmada: false } : consulta));
    } catch (error) {
      alert("Erro ao cancelar a consulta!");
    }
  }

  async function deletarConsulta(id) {
    try {
      await axios.delete(`http://localhost:3001/consultas/${id}`);
      setConsultas(consultas.filter(consulta => consulta.id !== id));
    } catch (error) {
      alert("Erro ao deletar a consulta!");
    }
  }

  function editarConsulta(id) {
    navigate(`/agendamento-consulta/${id}`);
  }

  return (
    <div className="container text-center py-4">
      <h1 className="fw-bold">Lista de Consultas</h1>
      <ul className="list-group">
        {consultas.map((consulta) => (
          <li key={consulta.id} className={`list-group-item ${consulta.confirmada ? 'list-group-item-success' : consulta.cancelada ? 'list-group-item-danger' : ''}`}>
            <div className="d-flex justify-content-between align-items-center">
              <span>{`Consulta ID: ${consulta.id} - Horário: ${consulta.horario} - Médico: ${consulta.nomeMedico} - Paciente: ${consulta.nomePaciente}`}</span>
              {usuario.perfil === "a" && (
                <>
                  <button className="btn btn-success" onClick={() => confirmarConsulta(consulta.id)}>Confirmar</button>
                  <button className="btn btn-danger" onClick={() => deletarConsulta(consulta.id)}>Deletar</button>
                  <button className="btn btn-warning" onClick={() => cancelarConsulta(consulta.id)}>Cancelar</button>
                </>
              )}
              {usuario.perfil === "p" && (
                <button className="btn btn-primary" onClick={() => editarConsulta(consulta.id)}>Editar Dados</button>
              )}
              {usuario.perfil === "m" && (
                <>
                  <button className="btn btn-success" onClick={() => confirmarConsulta(consulta.id)}>Confirmar</button>
                  <button className="btn btn-danger" onClick={() => cancelarConsulta(consulta.id)}>Cancelar</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}