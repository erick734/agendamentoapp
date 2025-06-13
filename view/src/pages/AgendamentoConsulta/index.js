import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import { consultaService } from "../../service/consultaService";
import { usuarioService } from "../../service/usuarioService";
import { empresaService } from "../../service/empresaService";
import Modal from "../../components/Modal";

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
  
  const [empresas, setEmpresas] = useState([]);
  const [idEmpresa, setIdEmpresa] = useState("");
  const [medicos, setMedicos] = useState([]);
  
  const [horariosDisponiveis, setHorariosDisponiveis] = useState(horariosFixos);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
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

  useEffect(() => {
    setLoadingEmpresas(true);
    empresaService.getEmpresas()
      .then(data => {
        setEmpresas(data || []);
      })
      .catch(err => {
        console.error("Erro ao buscar empresas:", err);
        setFormError("Não foi possível carregar as clínicas.");
      })
      .finally(() => setLoadingEmpresas(false));
  }, []);

  const carregarMedicosPorEmpresa = useCallback((empresaId) => {
    if (!empresaId) {
        setMedicos([]);
        setIdMedico("");
        return;
    }
    setLoadingMedicos(true);
    setMedicos([]);
    setIdMedico("");
    usuarioService.getMedicosPorEmpresa(empresaId)
      .then(data => {
        setMedicos(data || []);
      })
      .catch(err => {
        console.error("Erro ao carregar médicos:", err);
        setFormError("Não foi possível carregar os médicos desta clínica.");
      })
      .finally(() => setLoadingMedicos(false));
  }, []);

  useEffect(() => {
    carregarMedicosPorEmpresa(idEmpresa);
  }, [idEmpresa, carregarMedicosPorEmpresa]);

  const carregarHorariosDisponiveis = useCallback(async (medicoId, data) => {
    if (!medicoId || !data) {
      setHorariosDisponiveis(horariosFixos);
      return;
    }
    setLoadingHorarios(true);
    setFormError("");
    try {
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
      setFormError("Falha ao verificar horários.");
    } finally {
      setLoadingHorarios(false);
    }
  }, []);

  useEffect(() => {
    if (idMedico && dataConsulta) {
      carregarHorariosDisponiveis(idMedico, dataConsulta);
    }
  }, [idMedico, dataConsulta, carregarHorariosDisponiveis]);

  const handleSalvarOuEditar = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!usuarioLogado?.id) {
        setFormError("Erro: Usuário não identificado.");
        return;
    }
    if (!idEmpresa || !idMedico || !dataConsulta || !horario) {
        setFormError("Por favor, preencha todos os campos.");
        return;
    }
    setLoading(true);
    const dadosConsulta = {
      dataHora: `${dataConsulta}T${horario}:00`,
      idMedico: parseInt(idMedico),
      idPaciente: usuarioLogado.id, 
      descricao: descricao,
    };
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
      setFormError(error.response?.data?.message || "Erro ao salvar a consulta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={consultaProp ? "Editar Consulta" : "Agendar Nova Consulta"} onClose={onClose}>
        <form onSubmit={handleSalvarOuEditar} className="py-2">
          
          <div className="mb-3">
            <label htmlFor="empresa" className="form-label fw-bold">1. Escolha a Clínica</label>
            <select
              id="empresa"
              className="form-select"
              value={idEmpresa}
              onChange={(e) => setIdEmpresa(e.target.value)}
              disabled={loadingEmpresas || loading}
              required
            >
              <option value="">{loadingEmpresas ? "Carregando..." : "Selecione uma clínica"}</option>
              {empresas.map((emp) => (<option key={emp.id} value={emp.id}>{emp.nome}</option>))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="medico" className="form-label fw-bold">2. Escolha o Médico</label>
            <select 
              id="medico" 
              className="form-select" 
              value={idMedico} 
              onChange={(e) => setIdMedico(e.target.value)} 
              disabled={!idEmpresa || loadingMedicos || loading} 
              required
            >
              <option value="">{loadingMedicos ? "Carregando..." : "Primeiro, escolha uma clínica"}</option>
              {medicos.map((med) => (<option key={med.id} value={med.id}>{med.nome} {med.sobrenome || ""}</option>))}
            </select>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-7">
              <label htmlFor="dataConsulta" className="form-label fw-bold">3. Escolha a Data</label>
              <input type="date" id="dataConsulta" className="form-control" value={dataConsulta} onChange={(e) => setDataConsulta(e.target.value)} min={new Date().toISOString().split('T')[0]} required disabled={!idMedico || loading} />
            </div>
            <div className="col-md-5">
              <label htmlFor="horario" className="form-label fw-bold">4. Horário</label>
              <select id="horario" className="form-select" value={horario} onChange={(e) => setHorario(e.target.value)} disabled={!idMedico || !dataConsulta || loadingHorarios || horariosDisponiveis.length === 0 || loading} required>
                <option value="">{loadingHorarios ? "..." : "Selecione"}</option>
                {horariosDisponiveis.map(h => (<option key={h} value={h}>{h}</option>))}
              </select>
            </div>
          </div>
          
          {formError && (<p className="text-danger text-center small mt-3">{formError}</p>)}

          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">Descrição (Opcional)</label>
            <textarea id="descricao" className="form-control" rows="2" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Retorno, Exames..." disabled={loading}/>
          </div>
          
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading || !horario}>
                {loading ? "Salvando..." : (consultaProp ? "Salvar Alterações" : "Confirmar Agendamento")}
            </button>
          </div>
        </form>
    </Modal>
  );
}