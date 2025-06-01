import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectNome, selectIsAuthenticated } from "../../redux/authSlice";
import {
  fetchConsultas,
  selectAllConsultas,
  selectConsultasStatus,
  selectConsultasError,
} from "../../redux/consultaSlice";
import AgendamentoConsulta from "../AgendamentoConsulta";

export default function Consulta() {
  const dispatch = useDispatch();
  const [modalAberto, setModalAberto] = useState(false);
  const userDisplayName = useSelector(selectNome);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const consultas = useSelector(selectAllConsultas);
  const status = useSelector(selectConsultasStatus);
  const error = useSelector(selectConsultasError);

  useEffect(() => {
    if (isAuthenticated && status === "idle") {
      dispatch(fetchConsultas());
    }
  }, [status, dispatch, isAuthenticated]);

  const handleAgendamentoRealizado = () => {
    setModalAberto(false);
    dispatch(fetchConsultas());
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="alert alert-danger" role="alert">
          Erro ao carregar consultas: {error}
        </div>
      );
    }

    if (status === "succeeded") {
      return consultas.length > 0 ? (
        <ul className="list-group">
          {consultas.map((consulta) => (
            <li key={consulta.id} className="list-group-item">
              <p>
                <strong>Data:</strong>{" "}
                {new Date(consulta.dataConsulta).toLocaleString("pt-BR")}
              </p>
              <p>
                <strong>Médico:</strong> {consulta.nomeMedico || "N/A"}
              </p>
              <p>
                <strong>Paciente:</strong> {consulta.nomePaciente || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {consulta.status}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma consulta encontrada.</p>
      );
    }
    
    if (!isAuthenticated) {
      return (
        <div className="alert alert-warning" role="alert">
          Por favor, faça login para ver suas consultas.
        </div>
      )
    }

    return null;
  };

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold mb-4">
        Bem-vindo, {userDisplayName || "Usuário"}!
      </h1>

      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Suas Consultas</h2>
          {isAuthenticated && (
            <button
              className="btn btn-primary"
              onClick={() => setModalAberto(true)}
            >
              Agendar Nova Consulta
            </button>
          )}
        </div>
        {renderContent()}
      </div>

      {modalAberto && (
        <AgendamentoConsulta
          onClose={() => setModalAberto(false)}
          onAgendamentoRealizado={handleAgendamentoRealizado}
        />
      )}
    </div>
  );
}