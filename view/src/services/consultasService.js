import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

const API_URL = "http://localhost:3000/agendamento-consulta";

export default api;

export async function fetchConsultasPorMedico(medicoId) {
  try {
    const response = await api.get(`${API_URL}?usuarioMedicoId=${medicoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar consultas do médico:", error);
    return [];
  }
}

export async function fetchConsultas(usuario) {
  let url = "/consultas";

  if (usuario.perfil === "m") {
    url += `?usuarioMedicoId=${usuario.id}`;
  } else if (usuario.perfil === "p") {
    url += `?usuarioPacienteId=${usuario.id}`;
  }

  try {
    const response = await api.get(url);
    const consultasBase = response.data;

    const medicosPromise = consultasBase.map((consulta) =>
      consulta.usuarioMedicoId
        ? api.get(`/usuario/${consulta.usuarioMedicoId}`)
        : Promise.resolve(null)
    );

    const pacientesPromise = consultasBase.map((consulta) =>
      consulta.usuarioPacienteId
        ? api.get(`/usuario/${consulta.usuarioPacienteId}`)
        : Promise.resolve(null)
    );

    const medicos = await Promise.all(medicosPromise);
    const pacientes = await Promise.all(pacientesPromise);

    const consultasComDetalhes = consultasBase.map((consulta, index) => ({
      ...consulta,
      nomeMedico: medicos[index]?.data
        ? `${medicos[index].data.nome} ${medicos[index].data.sobrenome}`
        : "Nome do médico indisponível",
      nomePaciente: pacientes[index]?.data
        ? `${pacientes[index].data.nome} ${pacientes[index].data.sobrenome}`
        : "Nome do paciente indisponível",
    }));

    return consultasComDetalhes;
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    return [];
  }
}

export async function confirmarConsulta(id) {
  try {
    await api.patch(`/consultas/${id}`, { confirmada: true, cancelada: false });
  } catch (error) {
    console.error("Erro ao confirmar a consulta!", error);
  }
}

export async function cancelarConsulta(id) {
  try {
    await api.patch(`/consultas/${id}`, { cancelada: true, confirmada: false });
  } catch (error) {
    console.error("Erro ao cancelar a consulta!", error);
  }
}

export async function deletarConsulta(id) {
  try {
    await api.delete(`/consultas/${id}`);
  } catch (error) {
    console.error("Erro ao deletar a consulta!", error);
  }
}

export async function fetchMedicos() {
  try {
    const response = await api.get("/usuario?perfil=m");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar médicos:", error);
    return [];
  }
}

export async function fetchConsulta(id) {
  try {
    const response = await api.get(`/consultas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar a consulta:", error);
    return null;
  }
}

export async function agendarOuEditarConsulta(id, consulta) {
  try {
    if (id) {
      await api.patch(`/consultas/${id}`, consulta);
      return "Consulta atualizada com sucesso!";
    } else {
      await api.post("/consultas", consulta);
      return "Consulta agendada com sucesso!";
    }
  } catch (error) {
    console.error("Erro ao agendar ou editar a consulta!", error);
    return "Erro ao agendar a consulta!";
  }
}