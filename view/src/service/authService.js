import api from "./api";

const login = async (data) => {
  const response = await api.post("/auth/login", data);
  if (response.data.token && response.data.id) {
    const userData = { 
      id: response.data.id, 
      nome: response.data.nome, 
      perfil: response.data.perfil 
    };
    localStorage.setItem("authToken", JSON.stringify(response.data.token));
    localStorage.setItem("authUser", JSON.stringify(userData));
  }
  return response.data;
};

const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
};

export const authService = {
  login,
  logout,
};