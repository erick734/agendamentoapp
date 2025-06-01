import apiClient from "./api";

const cadastrar = async (cadastroRequest) => {
  const response = await apiClient.post("/usuario", cadastroRequest);
  return response.data;
};

const getUsuarioById = async (id) => {
  const response = await apiClient.get(`/usuario/${id}`);
  return response.data;
};

const atualizarPerfil = async (id, perfilData) => {
  const response = await apiClient.put(`/usuario/${id}`, perfilData);
  return response.data;
};

const listarUsuarios = async () => {
  const response = await apiClient.get("/usuario/listar");
  return response.data;
};

const getUsuariosPorPerfil = async (perfil) => {
  try {
    const response = await apiClient.get(`/usuario/perfil/${perfil}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuários com perfil ${perfil}:`, error);
    throw error;
  }
};

export const usuarioService = {
  cadastrar,
  getUsuarioById,
  atualizarPerfil,
  listarUsuarios,
  getUsuariosPorPerfil,
};