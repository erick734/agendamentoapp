import apiClient from "./api";

const getConsultas = async () => {
  const response = await apiClient.get("/consultas");
  return response.data;
};

const getConsultasPorMedico = async (medicoId) => {
  const response = await apiClient.get(`/consultas/medico/${medicoId}`);
  return response.data;
};

const getConsultasPorPaciente = async (pacienteId) => {
  const response = await apiClient.get(`/consultas/paciente/${pacienteId}`);
  return response.data;
};

const criarConsulta = async (consultaData) => {
  const response = await apiClient.post("/consultas", consultaData);
  return response.data;
};

const atualizarConsulta = async (id, consultaData) => {
  const response = await apiClient.put(`/consultas/${id}`, consultaData);
  return response.data;
};

const deletarConsulta = async (id) => {
  const response = await apiClient.delete(`/consultas/${id}`);
  return response.data;
};

const aprovarConsulta = async (id) => {
  const response = await apiClient.patch(`/consultas/${id}/aprovar`);
  return response.data;
}

const cancelarConsulta = async (id) => {
  const response = await apiClient.patch(`/consultas/${id}/cancelar`);
  return response.data;
}

export const consultaService = {
  getConsultas,
  getConsultasPorMedico,
  getConsultasPorPaciente,
  criarConsulta,
  atualizarConsulta,
  deletarConsulta,
  aprovarConsulta,
  cancelarConsulta,
};