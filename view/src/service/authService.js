import api from "./api";

const cadastrar = async (cadastroRequest) => {
  const response = await api.post("/usuario", cadastroRequest);
  return response.data;
};

const getUsuarioById = async (id) => {
  const response = await api.get(`/usuario/${id}`);
  return response.data;
};

const atualizarPerfil = async (id, perfilData) => {
  const response = await api.put(`/usuario/${id}/perfil`, perfilData);
  return response.data;
}

const listarUsuarios = async () => {
  const response = await api.get("/usuario");
  return response.data;
};

export const usuarioService = {
  cadastrar,
  getUsuarioById,
  atualizarPerfil,
  listarUsuarios,
};

const login = async (loginRequest) => {
  const response = await api.post("/auth", loginRequest);
  return response.data;
};

export const authService = { login };