import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../../context/Usuario";
import { fetchMedicos, fetchConsulta, agendarOuEditarConsulta, fetchConsultasPorMedico } from "../../services/consultasService";

const horariosFixos = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function AgendamentoConsulta() {
  const { id } = useParams();
  const { usuario } = useContext(UsuarioContext);
  const navigate = useNavigate();
  
  const [horario, setHorario] = useState("");
  const [medico, setMedico] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const medicosBase = await fetchMedicos();
        setMedicos(medicosBase);

        if (id) {
          const consulta = await fetchConsulta(id);
          if (consulta) {
            setHorario(consulta.horario);
            setMedico(consulta.usuarioMedicoId);
            setTelefone(consulta.telefone);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    carregarDados();
  }, [id]);

  useEffect(() => {
    async function carregarHorarios() {
      if (!medico) return;
      
      try {
        const consultasMedico = await fetchConsultasPorMedico(medico);
        const horariosOcupados = consultasMedico.map((c) => c.horario);
        const horariosFiltrados = horariosFixos.filter((h) => !horariosOcupados.includes(h));
        setHorariosDisponiveis(horariosFiltrados);
      } catch (error) {
        console.error("Erro ao carregar horários disponíveis:", error);
        setHorariosDisponiveis([]);
      }
    }
    carregarHorarios();
  }, [medico]);

  const validarTelefone = (numero) => {
    const numeroLimpo = numero.replace(/\D/g, "");

    if (numeroLimpo.length < 8 || numeroLimpo.length > 9) {
      setErroTelefone("Número inválido. Digite 8 ou 9 números.");
    } else if (numeroLimpo.length === 9 && numeroLimpo[0] !== "9") {
      setErroTelefone("Celular deve começar com 9.");
    } else {
      setErroTelefone("");
    }

    setTelefone(numero);
  };

  const handleAgendarConsulta = useCallback(async (e) => {
    e.preventDefault();

    if (!horario || !medico || !telefone) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (erroTelefone) {
      alert("Corrija o número de telefone antes de continuar.");
      return;
    }

    const novaConsulta = {
      horario,
      usuarioMedicoId: medico,
      usuarioPacienteId: usuario.id,
      telefone,
      confirmada: false,
      cancelada: false,
    };

    try {
      const mensagem = await agendarOuEditarConsulta(id, novaConsulta);
      alert(mensagem);
      navigate("/lista-consultas");
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      alert("Erro ao processar sua solicitação.");
    }
  }, [id, horario, medico, telefone, usuario.id, erroTelefone, navigate]);

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center fw-bold">{id ? "Editar Consulta" : "Agendamento de Consulta"}</h2>
        <p className="text-muted text-center">Preencha os campos abaixo para {id ? "editar" : "agendar"} sua consulta.</p>

        <form onSubmit={handleAgendarConsulta} className="mt-3">
          <div className="mb-3">
            <label htmlFor="medico" className="form-label fw-bold">Médico</label>
            <select
              id="medico"
              className="form-select form-select-lg"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
            >
              <option value="">Selecione um médico</option>
              {medicos.length > 0 ? (
                medicos.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.nome} {med.sobrenome}
                  </option>
                ))
              ) : (
                <option value="" disabled>Nenhum médico disponível</option>
              )}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="horario" className="form-label fw-bold">Horário</label>
            <select
              id="horario"
              className="form-select form-select-lg"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              disabled={!medico || horariosDisponiveis.length === 0}
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.length > 0 ? (
                horariosDisponiveis.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))
              ) : (
                <option value="" disabled>Sem horários disponíveis</option>
              )}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="telefone" className="form-label fw-bold">Contato</label>
            <input
              id="telefone"
              type="tel"
              className={`form-control form-control-lg ${erroTelefone ? "is-invalid" : ""}`}
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(e) => validarTelefone(e.target.value)}
            />
            {erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mt-3"
            disabled={!medico || horariosDisponiveis.length === 0 || !!erroTelefone}
          >
            {id ? "💾 Salvar Alterações" : "📅 Agendar Consulta"}
          </button>

          {/* Botão de Voltar para Home */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg w-100 mt-2"
            onClick={() => navigate("/")}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}
