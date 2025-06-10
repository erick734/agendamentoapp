import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../../redux/authSlice";
import { fetchConsultas, selectAllConsultas, selectConsultasStatus, selectConsultasError } from "../../redux/consultaSlice";
import { consultaService } from "../../service/consultaService";
import AgendamentoConsulta from "../AgendamentoConsulta";
import { Container } from 'react-bootstrap';

export default function Consulta() {
  const dispatch = useDispatch();
  const [modalAberto, setModalAberto] = useState(false);
  const [consultaParaEditar, setConsultaParaEditar] = useState(null);

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const consultas = useSelector(selectAllConsultas);
  const status = useSelector(selectConsultasStatus);
  const error = useSelector(selectConsultasError);

  useEffect(() => {
    if (isAuthenticated && status === "idle") {
      dispatch(fetchConsultas());
    }
  }, [status, dispatch, isAuthenticated]);

  const atualizarLista = () => {
    dispatch(fetchConsultas());
  };

  const handleAgendamentoRealizado = () => {
    setModalAberto(false);
    setConsultaParaEditar(null);
    atualizarLista();
  };

  const handleAprovar = async (id) => {
    if (window.confirm("Tem certeza que deseja aprovar esta consulta?")) {
      await consultaService.aprovarConsulta(id);
      atualizarLista();
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
      await consultaService.cancelarConsulta(id);
      atualizarLista();
    }
  };

  const handleDeletar = async (id) => {
    if (window.confirm("Atenção! Esta ação é irreversível. Deseja deletar a consulta?")) {
      await consultaService.deletarConsulta(id);
      atualizarLista();
    }
  };

  const handleAbrirEdicao = (consulta) => {
    setConsultaParaEditar(consulta);
    setModalAberto(true);
  };


  const renderContent = () => {
    if (status === "loading") {
      return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div></div>;
    }
    if (status === "failed") {
      return <div className="alert alert-danger" role="alert">Erro ao carregar consultas: {error}</div>;
    }
    if (status === "succeeded") {
      return consultas.length > 0 ? (
        <ul className="list-group">
          {consultas.map((consulta) => (
            <li key={consulta.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1"><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' })}</p>
                  <p className="mb-1"><strong>Médico:</strong> {consulta.nomeMedico || "N/A"}</p>
                  <p className="mb-0"><strong>Paciente:</strong> {consulta.nomePaciente || "N/A"}</p>
                </div>
                <span className={`badge rounded-pill text-dark bg-${consulta.status === 'APROVADA' ? 'success-subtle' : consulta.status === 'CANCELADA' ? 'danger-subtle' : 'warning-subtle'}`}>{consulta.status || 'AGUARDANDO'}</span>
              </div>

              <div className="mt-3 text-end">
                {/* Botões para o Médico */}
                {user?.perfil === 'm' && consulta.status?.toUpperCase() === 'AGUARDANDO' && (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleAprovar(consulta.id)}>Aprovar</button>
                    <button className="btn btn-warning btn-sm" onClick={() => handleCancelar(consulta.id)}>Cancelar</button>
                  </>
                )}
                {/* Botão para o Paciente */}
                {user?.perfil === 'p' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleAbrirEdicao(consulta)}>Editar</button>
                )}
                {/* Botão para o Admin */}
                {user?.perfil === 'a' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(consulta.id)}>Deletar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center p-5 bg-light rounded"><p className="lead">Nenhuma consulta agendada.</p></div>
      );
    }
    if (!isAuthenticated) {
      return <div className="alert alert-warning text-center" role="alert">Por favor, faça login para ver suas consultas.</div>;
    }
    return null;
  };

  return (
    <Container className="py-4">
      <h1 className="text-center fw-bold mb-4">Bem-vindo, {user?.nome || "Usuário"}!</h1>
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0 h4">Suas Consultas</h2>
          {isAuthenticated && (
            <button className="btn btn-primary" onClick={() => { setConsultaParaEditar(null); setModalAberto(true); }}>
              Agendar Nova Consulta
            </button>
          )}
        </div>
        {renderContent()}
      </div>
      {modalAberto && (
        <AgendamentoConsulta
          consulta={consultaParaEditar}
          onClose={() => { setModalAberto(false); setConsultaParaEditar(null); }}
          onAgendamentoRealizado={handleAgendamentoRealizado}
        />
      )}
    </Container>
  );
}