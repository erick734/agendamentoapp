import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, selectIsAuthenticated, logout } from "../../redux/authSlice";
import { consultaService } from "../../service/consultaService";
import AgendamentoConsulta from "../AgendamentoConsulta";
import { Container } from 'react-bootstrap';
import styles from './index.module.css';

export default function Consulta() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [consultas, setConsultas] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [consultaParaEditar, setConsultaParaEditar] = useState(null);
  const [expandedConsultaId, setExpandedConsultaId] = useState(null);

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
 
  const buscarMinhasConsultas = useCallback(async () => {
    if (!user) return;
    setStatus("loading");
    setError(null);
    try {
      let data;
      switch (user.perfil?.toUpperCase()) {
        case "A":
          data = [];
          break;
        case "M":
          data = await consultaService.getConsultasPorMedico(user.id);
          break;
        case "P":
          data = await consultaService.getConsultasPorPaciente(user.id);
          break;
        default:
          data = [];
          break;
      }
      setConsultas(Array.isArray(data) ? data : []);
      setStatus("succeeded");
    } catch (err) {
      setError(err.response?.data || "Erro ao carregar consultas.");
      setStatus("failed");
    }
  }, [user]);
  
  useEffect(() => {
    if (isAuthenticated) {
      buscarMinhasConsultas();
    }
  }, [isAuthenticated, buscarMinhasConsultas]);

  const handleToggleExpand = (id) => {
    setExpandedConsultaId(expandedConsultaId === id ? null : id);
  };

  const handleAction = async (actionCallback) => {
    try {
      await actionCallback();
      buscarMinhasConsultas();
    } catch (error) {
      console.error("Falha na ação:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "Ocorreu um erro. Você pode não ter permissão para esta ação.";
      alert(errorMsg);

      if (error.response?.status === 403) {
          dispatch(logout());
          navigate("/login");
      }
    }
  };

  const handleAprovar = (id) => {
    if (window.confirm("Tem certeza que deseja aprovar esta consulta?")) {
      handleAction(() => consultaService.aprovarConsulta(id));
    }
  };

  const handleCancelar = (id) => {
    if (window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
      handleAction(() => consultaService.cancelarConsulta(id));
    }
  };

  const handleDeletar = (id) => {
    if (window.confirm("Atenção! Esta ação é irreversível. Deseja deletar?")) {
      handleAction(() => consultaService.deletarConsulta(id));
    }
  };
  
  const handleAgendamentoRealizado = () => {
    setModalAberto(false);
    setConsultaParaEditar(null);
    buscarMinhasConsultas();
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
    if (!isAuthenticated) return <div className="alert alert-warning text-center" role="alert">Por favor, faça login para ver suas consultas.</div>;
    if (status === "loading" && consultas.length === 0) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div></div>;
    if (status === "failed") return <div className="alert alert-danger" role="alert">Erro ao carregar consultas: {error}</div>;
    if (consultas.length === 0) return <div className="text-center p-5 bg-light rounded"><p className="lead">Nenhuma consulta agendada no momento.</p></div>;
    
    return (
      <ul className={styles.consultaList}>
        {consultas.map((consulta) => (
          <li key={consulta.id} className={styles.consultaItem}>
            <div className={styles.itemHeader} onClick={() => handleToggleExpand(consulta.id)}>
              <div className={styles.headerInfo}>
                <p>Consulta para <strong>{new Date(consulta.dataHora).toLocaleDateString("pt-BR", {day: '2-digit', month: '2-digit', year: 'numeric'})}</strong></p>
                <p>às <strong>{new Date(consulta.dataHora).toLocaleTimeString("pt-BR", { timeStyle: 'short' })}</strong></p>
              </div>
              <div className={styles.headerInfo}>
                <span className={`${styles.statusBadge} ${getStatusClass(consulta.status)}`}>
                  {consulta.status || 'AGUARDANDO'}
                </span>
                <span className={`${styles.toggleIcon} ${expandedConsultaId === consulta.id ? styles.open : ''}`}>
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>
            <div className={`${styles.itemBody} ${expandedConsultaId === consulta.id ? styles.open : ''}`}>
              <div className={styles.detailsGrid}>
                <strong>Médico:</strong><span>{consulta.nomeMedico || "N/A"}</span>
                <strong>Paciente:</strong><span>{consulta.nomePaciente || "N/A"}</span>
                {consulta.descricao && (<><strong>Descrição:</strong><span>{consulta.descricao}</span></>)}
              </div>
              <div className={styles.actionsContainer}>
                {user?.perfil === 'm' && consulta.status?.toUpperCase() === 'AGUARDANDO' && (
                  <><button className="btn btn-success btn-sm me-2" onClick={() => handleAprovar(consulta.id)}><i className="bi bi-check-lg"></i> Aprovar</button><button className="btn btn-danger btn-sm" onClick={() => handleCancelar(consulta.id)}><i className="bi bi-x-lg"></i> Cancelar</button></>
                )}
                {user?.perfil === 'p' && (
                  <><button className="btn btn-secondary btn-sm" onClick={() => handleAbrirEdicao(consulta)}><i className="bi bi-pencil-fill"></i> Editar</button>
                  {['AGUARDANDO', 'APROVADA'].includes(consulta.status?.toUpperCase()) && (<button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelar(consulta.id)}>Cancelar Agendamento</button>)}</>
                )}
                {user?.perfil === 'a' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(consulta.id)}>Deletar</button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Container className="py-4">
        <h1 className="text-center fw-bold mb-4">Minhas Consultas</h1>
        <div className={styles.pageCard}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Agendamentos</h2>
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