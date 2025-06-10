import apiClient from "./api";

const getConsultaById = async (id) => {
  const response = await apiClient.get(`/consultas/${id}`);
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

const getConsultasPorMedico = async (medicoId) => {
    try {
        const response = await apiClient.get(`/consultas/medico/${medicoId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar consultas do médico:", error);
        throw error;
    }
}


export const consultaService = {
  getConsultaById,
  criarConsulta,
  atualizarConsulta,
  deletarConsulta,
  aprovarConsulta,
  cancelarConsulta,
  getConsultasPorMedico,
};