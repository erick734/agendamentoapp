import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, selectIsAuthenticated, logout } from "../../redux/authSlice";
import { 
  fetchConsultas, 
  selectAllConsultas, 
  selectConsultasStatus, 
  selectConsultasError
} from "../../redux/consultaSlice";
import { consultaService } from "../../service/consultaService";
import AgendamentoConsulta from "../AgendamentoConsulta";
import { Container } from 'react-bootstrap';
import styles from './index.module.css';

export default function Consulta() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [consultaParaEditar, setConsultaParaEditar] = useState(null);

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const consultas = useSelector(selectAllConsultas);
  const status = useSelector(selectConsultasStatus);
  const error = useSelector(selectConsultasError);

  useEffect(() => {
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchConsultas());
    }
  }, [status, dispatch, isAuthenticated]);
  
  const handleAprovar = async (id) => {
    if (window.confirm("Tem certeza que deseja aprovar esta consulta?")) {
      try {
        await consultaService.aprovarConsulta(id);
        dispatch(fetchConsultas());
      } catch (error) {
        alert(error.response?.data || "Erro ao aprovar consulta.");
      }
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
      try {
        await consultaService.cancelarConsulta(id);
        dispatch(fetchConsultas());
      } catch (error) {
        alert(error.response?.data || "Erro ao cancelar consulta.");
      }
    }
  };

  const handleDeletar = async (id) => {
    if (window.confirm("Atenção! Esta ação é irreversível. Deseja deletar a consulta?")) {
      try {
        await consultaService.deletarConsulta(id);
        dispatch(fetchConsultas());
      } catch (error) {
        alert(error.response?.data || "Erro ao deletar consulta.");
      }
    }
  };
  
  const handleAgendamentoRealizado = () => {
    setModalAberto(false);
    setConsultaParaEditar(null);
    dispatch(fetchConsultas());
  };

  const handleAbrirEdicao = (consulta) => {
    setConsultaParaEditar(consulta);
    setModalAberto(true);
  };
  
  const handleAbrirAgendamento = () => {
    setConsultaParaEditar(null);
    setModalAberto(true);
  };

  const getStatusClass = (status) => {
    const upperStatus = status?.toUpperCase() || 'AGUARDANDO';
    switch (upperStatus) {
      case 'APROVADA': return styles.statusAprovada;
      case 'CANCELADA':
      case 'REJEITADA': return styles.statusCancelada;
      default: return styles.statusAguardando;
    }
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <div className="alert alert-warning text-center" role="alert">Por favor, faça login para ver suas consultas.</div>;
    }
    if (status === "loading" && consultas.length === 0) {
      return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div></div>;
    }
    if (status === "failed" && !consultas.length) {
      return <div className="alert alert-danger" role="alert">Erro ao carregar consultas: {error}</div>;
    }
    if (status === "succeeded" && consultas.length === 0) {
      return <div className="text-center p-5 bg-light rounded"><p className="lead">Nenhuma consulta agendada no momento.</p></div>;
    }
    return (
      <ul className={styles.consultaList}>
        {consultas.map((consulta) => (
          <li key={consulta.id} className={styles.consultaItem}>
            <div className={styles.consultaDetails}>
              <div className={styles.info}>
                <p className="mb-1"><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p className="mb-1"><strong>Médico:</strong> {consulta.nomeMedico || "N/A"}</p>
                <p className="mb-0"><strong>Paciente:</strong> {consulta.nomePaciente || "N/A"}</p>
              </div>
              <span className={`${styles.statusBadge} ${getStatusClass(consulta.status)}`}>
                {consulta.status || 'AGUARDANDO'}
              </span>
            </div>
            <div className={styles.actionsContainer}>
              {user?.perfil === 'm' && consulta.status?.toUpperCase() === 'AGUARDANDO' && (
                <>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleAprovar(consulta.id)}>Aprovar</button>
                  <button className="btn btn-warning btn-sm" onClick={() => handleCancelar(consulta.id)}>Cancelar</button>
                </>
              )}
              {user?.perfil === 'p' && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleAbrirEdicao(consulta)}>Editar</button>
              )}
              {user?.perfil === 'a' && (
                <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(consulta.id)}>Deletar</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Container className="py-4">
        <h1 className="text-center fw-bold mb-4">Bem-vindo, {user?.nome || "Usuário"}!</h1>
        <div className={styles.pageCard}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Suas Consultas</h2>
            {isAuthenticated && user?.perfil !== 'm' && (
              <button className="btn btn-primary" onClick={handleAbrirAgendamento}>
                <i className="bi bi-plus-circle me-2"></i>
                Agendar Nova Consulta
              </button>
            )}
          </div>
          {renderContent()}
        </div>
      </Container>

      {modalAberto && (
        <AgendamentoConsulta
          consulta={consultaParaEditar}
          onClose={() => { setModalAberto(false); setConsultaParaEditar(null); }}
          onAgendamentoRealizado={handleAgendamentoRealizado}
        />
      )}
    </>
  );
}