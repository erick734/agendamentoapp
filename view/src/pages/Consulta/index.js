import React, { useContext, useEffect, useState, useCallback } from "react";
import { UsuarioContext } from "../../context/Usuario";
import { useNavigate } from "react-router-dom";
import { fetchConsultas, confirmarConsulta, cancelarConsulta, deletarConsulta } from "../../services/consultasService";

export default function Consulta() {
  const { usuario } = useContext(UsuarioContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const carregarConsultas = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const consultasBase = await fetchConsultas(usuario);
      setConsultas(consultasBase);
    } catch (error) {
      setErro("Erro ao carregar consultas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregarConsultas();
  }, [carregarConsultas]);

  async function handleConfirmar(id) {
    try {
      await confirmarConsulta(id);
      setConsultas((prev) => prev.map(consulta => consulta.id === id ? { ...consulta, confirmada: true, cancelada: false } : consulta));
    } catch (error) {
      alert("Erro ao confirmar consulta!");
    }
  }

  async function handleCancelar(id) {
    try {
      await cancelarConsulta(id);
      setConsultas((prev) => prev.map(consulta => consulta.id === id ? { ...consulta, cancelada: true, confirmada: false } : consulta));
    } catch (error) {
      alert("Erro ao cancelar consulta!");
    }
  }

  async function handleDeletar(id) {
    try {
      await deletarConsulta(id);
      setConsultas((prev) => prev.filter(consulta => consulta.id !== id));
    } catch (error) {
      alert("Erro ao deletar consulta!");
    }
  }

  function editarConsulta(id) {
    navigate(`/agendamento-consulta/${id}`);
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center fw-bold mb-3">📋Consultas Marcadas</h2>

        {loading && <p className="text-center">Carregando consultas...</p>}
        {erro && <p className="text-danger text-center">{erro}</p>}
        {!loading && consultas.length === 0 && <p className="text-muted text-center">Nenhuma consulta encontrada.</p>}

        {!loading && consultas.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Horário</th>
                  <th>Médico</th>
                  <th>Paciente</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map((consulta) => (
                  <tr key={consulta.id} className={consulta.confirmada ? "table-success" : consulta.cancelada ? "table-danger" : ""}>
                    <td>{consulta.horario}</td>
                    <td>{consulta.nomeMedico}</td>
                    <td>{consulta.nomePaciente}</td>
                    <td>
                      {consulta.confirmada ? (
                        <span className="badge bg-success">Confirmada</span>
                      ) : consulta.cancelada ? (
                        <span className="badge bg-danger">Cancelada</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pendente</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        {usuario.perfil === "a" && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleConfirmar(consulta.id)} title="Confirmar">
                              ✅
                            </button>
                            <button className="btn btn-warning btn-sm" onClick={() => handleCancelar(consulta.id)} title="Cancelar">
                              ⚠️
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(consulta.id)} title="Deletar">
                              🗑️
                            </button>
                          </>
                        )}

                        {usuario.perfil === "p" && consulta.usuarioPacienteId === usuario.id && (
                          <button className="btn btn-primary btn-sm" onClick={() => editarConsulta(consulta.id)} title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/></svg>
                          </button>
                        )}

                        {usuario.perfil === "m" && consulta.usuarioMedicoId === usuario.id && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleConfirmar(consulta.id)} title="Confirmar">
                              ✅
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancelar(consulta.id)} title="Cancelar">
                              ❌
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
