import apiClient from "./api";

const cadastrar = async (cadastroRequest) => {
  const response = await apiClient.post("/usuario", cadastroRequest);
  return response.data; // Mensagem de sucesso ou dados do usuário criado
};

const getUsuarioById = async (id) => {
  const response = await apiClient.get(`/usuario/${id}`);
  return response.data;
};

const atualizarPerfil = async (id, perfilData) => {
  const response = await apiClient.put(`/usuario/${id}/perfil`, perfilData); // Exemplo de endpoint
  return response.data;
}

const listarUsuarios = async () => {
  const response = await apiClient.get("/usuario");
  return response.data;
};

export const usuarioService = {
  cadastrar,
  getUsuarioById,
  atualizarPerfil,
  listarUsuarios
};