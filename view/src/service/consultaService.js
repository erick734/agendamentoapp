import apiClient from "./api";

const getConsultas = async () => {
  try {
    const response = await apiClient.get("/consultas");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    throw error;
  }
};

const getConsultaById = async (id) => {
  const response = await apiClient.get(`/consultas/${id}`);
  return response.data;
};

const criarConsulta = async (consultaData) => {
  const response = await apiClient.post("/consultas", consultaData);
  return response.data;
};

const atualizarConsulta = async (id, consultaData) => {
  const response = await apiClient.patch(`/consultas/${id}`, consultaData);
  return response.data;
};

const deletarConsulta = async (id) => {
  const response = await apiClient.delete(`/consultas/${id}`);
  return response.data;
};

const confirmarConsulta = async (id) => {
  const response = await apiClient.patch(`/consultas/${id}/confirmar`, {});
  return response.data;
}

const cancelarConsulta = async (id) => {
  const response = await apiClient.patch(`/consultas/${id}/cancelar`, {});
  return response.data;
}

export const consultaService = {
  getConsultas,
  getConsultaById,
  criarConsulta,
  atualizarConsulta,
  deletarConsulta,
  confirmarConsulta,
  cancelarConsulta,
};