import React, { useContext, useEffect, useState, useCallback } from "react";
import { UsuarioContext } from "../../context/Usuario";
import { useNavigate } from "react-router-dom";
import { fetchConsultas, confirmarConsulta, cancelarConsulta, deletarConsulta } from "../../services/consultasService";
import AgendamentoConsulta from "../AgendamentoConsulta";

export default function Consulta() {
  const { usuario } = useContext(UsuarioContext);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);

  const carregarConsultas = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const consultasBase = await fetchConsultas(usuario);
      let consultasFiltradas = [];
      if (usuario.perfil === "p") {
        consultasFiltradas = consultasBase.filter(
          (consulta) => consulta.usuarioPacienteId === usuario.id
        );
      } else if (usuario.perfil === "m") {
        consultasFiltradas = consultasBase.filter(
          (consulta) => consulta.usuarioMedicoId === usuario.id
        );
      } else if (usuario.perfil === "a") {
        consultasFiltradas = consultasBase;
      }
      setConsultas(consultasFiltradas);
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
      setConsultas((prev) =>
        prev.map((consulta) =>
          consulta.id === id ? { ...consulta, confirmada: true, cancelada: false } : consulta
        )
      );
    } catch (error) {
      alert("Erro ao confirmar consulta!");
    }
  }

  async function handleCancelar(id) {
    try {
      await cancelarConsulta(id);
      setConsultas((prev) =>
        prev.map((consulta) =>
          consulta.id === id ? { ...consulta, cancelada: true, confirmada: false } : consulta
        )
      );
    } catch (error) {
      alert("Erro ao cancelar consulta!");
    }
  }

  async function handleDeletar(id) {
    try {
      await deletarConsulta(id);
      setConsultas((prev) => prev.filter((consulta) => consulta.id !== id));
    } catch (error) {
      alert("Erro ao deletar consulta!");
    }
  }

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold mb-1" style={{ lineHeight: "normal", margin: "0" }}>
        Bem-vindo, {usuario?.nome || "Usuário"}!
      </h1>
      <div className="card shadow-sm p-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          {(usuario.perfil === "a" || usuario.perfil === "p") && (
            <button
              onClick={() => setConsultaSelecionada({})}
              className="btn btn-primary btn-sm mb-0"
            >
              Agendar
            </button>
          )}
        </div>

        {loading && <p className="text-center">Carregando consultas...</p>}
        {erro && <p className="text-danger text-center">{erro}</p>}
        {!loading && consultas.length === 0 && (
          <p className="text-muted text-center">Nenhuma consulta encontrada.</p>
        )}

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
                  <tr
                    key={consulta.id}
                    className={
                      consulta.confirmada
                        ? "table-success"
                        : consulta.cancelada
                          ? "table-danger"
                          : ""
                    }
                  >
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
                        {/* ADM */}
                        {usuario.perfil === "a" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleConfirmar(consulta.id)}
                              title="Confirmar"
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
                            </button>
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleCancelar(consulta.id)}
                              title="Cancelar"
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeletar(consulta.id)}
                              title="Deletar"
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg>
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => setConsultaSelecionada(consulta)}
                              title="Editar"
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                            </button>
                          </>
                        )}

                        {/* PACIENTE */}
                        {usuario.perfil === "p" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setConsultaSelecionada(consulta)}
                            title="Editar"
                          ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                          </button>
                        )}

                        {/* MÉDICO */}
                        {usuario.perfil === "m" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleConfirmar(consulta.id)}
                              title="Confirmar"
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
                            </button>
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleCancelar(consulta.id)}
                              title="Cancelar"
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
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

        {consultaSelecionada && (
          <div
            className="modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <AgendamentoConsulta
                consulta={consultaSelecionada}
                fechar={() => setConsultaSelecionada(null)}
                atualizarConsultas={carregarConsultas}
              />

              <button
                onClick={() => setConsultaSelecionada(null)}
                className="btn btn-secondary mt-3"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
