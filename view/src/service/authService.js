import api from "./api";

const login = async (data) => {
  const response = await api.post("/auth/login", data);
  const { token, id, nome, perfil } = response.data;

  const userData = { id, nome, perfil };

  localStorage.setItem("authToken", JSON.stringify(token));
  localStorage.setItem("authUser", JSON.stringify(userData));

  return response.data;
};

const cadastrar = async (cadastroRequest) => {
  const response = await api.post("/usuario", cadastroRequest);
  return response.data;
};

export const authService = {
  login,
  cadastrar,
};
