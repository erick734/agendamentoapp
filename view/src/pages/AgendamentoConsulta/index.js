import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import { consultaService } from "../../service/consultaService";
import { usuarioService } from "../../service/usuarioService";
import styles from "./index.module.css";

const horariosFixos = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

export default function AgendamentoConsulta({ consulta: consultaProp, onClose, onAgendamentoRealizado }) {
  
  const usuarioLogado = useSelector(selectUser);

  const [dataConsulta, setDataConsulta] = useState(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState("");
  const [idMedico, setIdMedico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(horariosFixos);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    if (consultaProp) {
      setDataConsulta(consultaProp.dataHora ? consultaProp.dataHora.split('T')[0] : '');
      setHorario(consultaProp.dataHora ? consultaProp.dataHora.split('T')[1].substring(0, 5) : '');
      setIdMedico(consultaProp.idMedico || '');
      setDescricao(consultaProp.descricao || '');
    }
  }, [consultaProp]);

  const carregarMedicos = useCallback(async () => {
    setLoadingMedicos(true);
    try {
      const listaMedicos = await usuarioService.getUsuariosPorPerfil("m");
      setMedicos(listaMedicos || []);
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
      setFormError("Falha ao carregar a lista de médicos.");
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
      // ✨ CORRIGIDO: A função do service agora retorna os dados diretamente (o array)
      const consultasDoMedico = await consultaService.getConsultasPorMedico(medicoId);
      
      const horariosOcupadosNaData = consultasDoMedico
        .filter(c => c.dataHora && c.dataHora.startsWith(data))
        .map(c => c.dataHora.split('T')[1].substring(0, 5));

      const disponiveis = horariosFixos.filter(h => !horariosOcupadosNaData.includes(h));
      setHorariosDisponiveis(disponiveis);

      if (disponiveis.length === 0) {
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
    }
  }, [idMedico, dataConsulta, carregarHorariosDisponiveis]);

  const handleSalvarOuEditar = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!usuarioLogado?.id) {
        setFormError("Erro: Usuário não identificado. Por favor, faça o login novamente.");
        return;
    }
    if (!dataConsulta || !horario || !idMedico) {
        setFormError("Por favor, preencha a data, horário e selecione um médico.");
        return;
    }
    const dataHoraCompleta = `${dataConsulta}T${horario}:00`;
    const dadosConsulta = {
      dataHora: dataHoraCompleta,
      idMedico: parseInt(idMedico),
      idPaciente: usuarioLogado.id, 
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
      if (onAgendamentoRealizado) onAgendamentoRealizado();
      if (onClose) onClose();
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "Erro ao salvar a consulta.";
      setFormError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      if (onClose) onClose();
    }
  };
  
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {consultaProp ? "Editar Consulta" : "Agendar Consulta"}
          </h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Fechar modal">&times;</button>
        </div>
        <form onSubmit={handleSalvarOuEditar} className="mt-3">
          <div className="mb-3">
            <label htmlFor="medico" className="form-label fw-bold">Médico</label>
            <select id="medico" className="form-select form-select-lg" value={idMedico} onChange={(e) => setIdMedico(e.target.value)} disabled={loadingMedicos} required>
              <option value="">{loadingMedicos ? "Carregando médicos..." : "Selecione um médico"}</option>
              {medicos.map((med) => (<option key={med.id} value={med.id}>{med.nome} {med.sobrenome || ""}</option>))}
            </select>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="dataConsulta" className="form-label fw-bold">Data</label>
              <input type="date" id="dataConsulta" className="form-control form-control-lg" value={dataConsulta} onChange={(e) => setDataConsulta(e.target.value)} min={new Date().toISOString().split('T')[0]} required disabled={!idMedico} />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="horario" className="form-label fw-bold">Horário</label>
              <select id="horario" className="form-select form-select-lg" value={horario} onChange={(e) => setHorario(e.target.value)} disabled={!idMedico || !dataConsulta || loadingHorarios || horariosDisponiveis.length === 0} required>
                <option value="">{loadingHorarios ? "Verificando..." : "Selecione um horário"}</option>
                {horariosDisponiveis.map(h => (<option key={h} value={h}>{h}</option>))}
              </select>
              {horariosDisponiveis.length === 0 && idMedico && dataConsulta && !loadingHorarios && (<small className="text-danger d-block mt-1">{formError || "Nenhum horário disponível."}</small>)}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="descricao" className="form-label fw-bold">Descrição (Opcional)</label>
            <textarea id="descricao" className="form-control" rows="3" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Retorno, Check-up anual..." />
          </div>
          {formError && !horariosDisponiveis.length && <p className="text-danger text-center">{formError}</p>}
          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || loadingMedicos || loadingHorarios || !idMedico || !dataConsulta || !horario}>
                {loading ? "Salvando..." : (consultaProp ? "Salvar Alterações" : "Agendar Consulta")}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}