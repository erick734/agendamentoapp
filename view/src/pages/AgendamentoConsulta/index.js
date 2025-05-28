import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { consultaService } from "../../service/consultaService";
import { usuarioService } from "../../service/usuarioService";

const horariosFixos = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function AgendamentoConsulta({ consulta, fechar, atualizarConsultas }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [horario, setHorario] = useState(consulta?.horario || "");
  const [medico, setMedico] = useState(consulta?.usuarioMedicoId || "");
  const [telefone, setTelefone] = useState(consulta?.telefone || "");
  const [erroTelefone, setErroTelefone] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // ✔️ Validação de telefone
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

  // ✔️ Carregar médicos
  const carregarMedicos = useCallback(async () => {
    setLoading(true);
    try {
      const listaMedicos = await usuarioService.getUsuariosPorPerfil("m");
      setMedicos(listaMedicos);
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
      setFormError("Erro ao carregar a lista de médicos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✔️ Carregar horários disponíveis para o médico selecionado
  const carregarHorarios = useCallback(async () => {
    if (!medico) {
      setHorariosDisponiveis([]);
      return;
    }
    setLoading(true);
    try {
      const consultasDoMedico = await consultaService.getConsultas({ usuarioMedicoId: medico });
      const horariosOcupados = consultasDoMedico.map(c => c.horario);
      const disponiveis = horariosFixos.filter(h => !horariosOcupados.includes(h));
      setHorariosDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      setHorariosDisponiveis([]);
    } finally {
      setLoading(false);
    }
  }, [medico]);

  // ✔️ Salvando ou editando a consulta
  const handleSalvarOuEditar = async (e) => {
    e.preventDefault();
    setFormError("");

    if (erroTelefone) {
      setFormError("Corrija o telefone.");
      return;
    }
    // if (!usuario || !usuario.id) {
    //   setFormError("Usuário não identificado. Faça login novamente.");
    //   return;
    // }

    const dadosConsulta = {
      horario,
      usuarioMedicoId: medico,
      // usuarioPacienteId: usuario.id,
      telefone,
      confirmada: false,
      cancelada: false,
    };

    setLoading(true);
    try {
      if (consulta?.id) {
        await consultaService.atualizarConsulta(consulta.id, dadosConsulta);
        alert("Consulta atualizada com sucesso!");
      } else {
        await consultaService.criarConsulta(dadosConsulta);
        alert("Consulta agendada com sucesso!");
      }

      if (typeof fechar === 'function') fechar();
      if (typeof atualizarConsultas === 'function') atualizarConsultas();
      navigate('/');

    } catch (error) {
      console.error("Erro ao salvar:", error);
      setFormError(error.response?.data?.message || "Erro ao salvar a consulta.");
    } finally {
      setLoading(false);
    }
  };

  // ✔️ Effects
  useEffect(() => {
    carregarMedicos();
  }, [carregarMedicos]);

  useEffect(() => {
    carregarHorarios();
  }, [carregarHorarios]);

  // ✔️ Loader inicial
  if (loading && !medicos.length) return <p>Carregando dados...</p>;

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center fw-bold mb-1">
          {consulta ? "Editar Consulta" : "Agendamento de Consulta"}
        </h2>
        <p className="text-muted text-center">
          Preencha os campos abaixo para {consulta ? "editar" : "agendar"} sua consulta.
        </p>

        <form onSubmit={handleSalvarOuEditar} className="mt-3">
          <div className="mb-3">
            <label htmlFor="medico" className="form-label fw-bold">Médico</label>
            <select
              id="medico"
              className="form-select form-select-lg"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
            >
              <option value="">Selecione um médico</option>
              {medicos.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nome} {med.sobrenome}
                </option>
              ))}
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
              {horariosDisponiveis.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
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

          {formError && <p className="text-danger text-center">{formError}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mt-3"
            disabled={!medico || horariosDisponiveis.length === 0 || !!erroTelefone}
          >
            {loading ? "Salvando..." : (consulta ? "Salvar" : "Agendar")}
          </button>
        </form>
      </div>
    </div>
  );
}
