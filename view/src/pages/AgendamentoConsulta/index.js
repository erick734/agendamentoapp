import React, { useState, useEffect, useCallback } from "react";
import { consultaService } from "../../service/consultaService";
import { usuarioService } from "../../service/usuarioService";
import styles from "./index.module.css"; 

const horariosFixos = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function AgendamentoConsulta({ consulta: consultaProp, onClose, onAgendamentoRealizado }) {
  
  const [dataConsulta, setDataConsulta] = useState(consultaProp?.dataHora ? consultaProp.dataHora.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState(consultaProp?.dataHora ? consultaProp.dataHora.split('T')[1].substring(0,5) : "");
  const [idMedico, setIdMedico] = useState(consultaProp?.idMedico || "");
  const [descricao, setDescricao] = useState(consultaProp?.descricao || "");

  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(horariosFixos);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const carregarMedicos = useCallback(async () => {
    setLoadingMedicos(true);
    setFormError("");
    try {
      const listaMedicos = await usuarioService.getUsuariosPorPerfil("m");
      setMedicos(listaMedicos || []);
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
      setFormError("Falha ao carregar a lista de médicos.");
      setMedicos([]);
    } finally {
      setLoadingMedicos(false);
    }
  }, []);

  const carregarHorariosDisponiveis = useCallback(async (medicoId, data) => {
    if (!medicoId || !data) {
      setHorariosDisponiveis(horariosFixos);
      return;
    }
    setLoadingHorarios(true);
    setFormError("");
    try {
      const todasConsultas = await consultaService.getConsultas();
      const horariosOcupadosNaData = todasConsultas
        .filter(c => c.idMedico === parseInt(medicoId) && c.dataHora && c.dataHora.startsWith(data))
        .map(c => c.dataHora.split('T')[1].substring(0,5));

      const disponiveis = horariosFixos.filter(h => !horariosOcupadosNaData.includes(h));
      setHorariosDisponiveis(disponiveis);
      if (disponiveis.length === 0 && medicoId && data) {
        setFormError("Nenhum horário disponível para este médico nesta data.");
      }
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      setFormError("Falha ao verificar horários.");
      setHorariosDisponiveis(horariosFixos);
    } finally {
      setLoadingHorarios(false);
    }
  }, []);

  useEffect(() => {
    carregarMedicos();
  }, [carregarMedicos]);

  useEffect(() => {
    if (idMedico && dataConsulta) {
      carregarHorariosDisponiveis(idMedico, dataConsulta);
    } else {
      setHorariosDisponiveis(horariosFixos);
    }
  }, [idMedico, dataConsulta, carregarHorariosDisponiveis]);

  const handleSalvarOuEditar = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!dataConsulta || !horario || !idMedico) {
        setFormError("Por favor, preencha a data, horário e selecione um médico.");
        return;
    }

    const dataHoraCompleta = `${dataConsulta}T${horario}:00`;

    const dadosConsulta = {
      dataHora: dataHoraCompleta,
      idMedico: parseInt(idMedico),
      descricao: descricao,
    };

    setLoading(true);
    try {
      if (consultaProp?.id) {
        await consultaService.atualizarConsulta(consultaProp.id, dadosConsulta);
        alert("Consulta atualizada com sucesso!");
      } else {
        await consultaService.criarConsulta(dadosConsulta);
        alert("Consulta agendada com sucesso!");
      }

      if (typeof onAgendamentoRealizado === 'function') onAgendamentoRealizado();
      if (typeof onClose === 'function') onClose();

    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Erro ao salvar a consulta.";
      setFormError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {

    if (e.target === e.currentTarget) {
      if (typeof onClose === 'function') onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {consultaProp ? "Editar Consulta" : "Agendar Consulta"}
          </h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Fechar modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSalvarOuEditar} className="mt-3">
          <div className="mb-3">
            <label htmlFor="medico" className={`form-label ${styles.formLabel}`}>Médico</label>
            <select
              id="medico"
              className={`form-select form-select-lg ${styles.formSelect}`}
              value={idMedico}
              onChange={(e) => setIdMedico(e.target.value)}
              disabled={loadingMedicos}
              required
            >
              <option value="">{loadingMedicos ? "Carregando médicos..." : "Selecione um médico"}</option>
              {medicos.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nome} {med.sobrenome || ""}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
                <label htmlFor="dataConsulta" className={`form-label ${styles.formLabel}`}>Data</label>
                <input
                    type="date"
                    id="dataConsulta"
                    className={`form-control form-control-lg ${styles.formInput}`}
                    value={dataConsulta}
                    onChange={(e) => setDataConsulta(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    disabled={!idMedico}
                />
            </div>
            <div className="col-md-6 mb-3">
                <label htmlFor="horario" className={`form-label ${styles.formLabel}`}>Horário</label>
                <select
                    id="horario"
                    className={`form-select form-select-lg ${styles.formSelect}`}
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    disabled={!idMedico || !dataConsulta || loadingHorarios || horariosDisponiveis.length === 0}
                    required
                >
                <option value="">{loadingHorarios ? "Verificando..." : "Selecione um horário"}</option>
                {horariosDisponiveis.map(h => (
                    <option key={h} value={h}>{h}</option>
                ))}
                </select>
                {horariosDisponiveis.length === 0 && idMedico && dataConsulta && !loadingHorarios && (
                    <small className="text-muted d-block mt-1">Nenhum horário disponível.</small>
                )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="descricao" className={`form-label ${styles.formLabel}`}>Descrição (Opcional)</label>
            <textarea
              id="descricao"
              className={`form-control ${styles.formInput}`}
              rows="3"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Retorno, Check-up anual, Dor de cabeça"
            />
          </div>

          {formError && <p className={styles.errorMessage}>{formError}</p>}

          <div className="d-grid gap-2">
            <button
                type="submit"
                className={`btn btn-primary btn-lg ${styles.submitButton}`}
                disabled={loading || loadingMedicos || loadingHorarios || !idMedico || !dataConsulta || !horario}
            >
                {loading ? "Salvando..." : (consultaProp ? "Salvar Alterações" : "Agendar Consulta")}
            </button>
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
            >
                Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}