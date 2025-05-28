// SEU api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const tokenItem = localStorage.getItem("authToken"); // Pega o item do localStorage
    if (tokenItem) {
      // Seu authSlice salva o token com JSON.stringify, então JSON.parse é necessário aqui.
      const token = JSON.parse(tokenItem);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpar o estado do Redux também seria bom aqui, se possível,
      // ou garantir que a navegação para /login leve a uma reinicialização do estado.
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authId");
      // Opcional: Despachar a ação de logout do Redux
      // import store from '../redux/store'; // Cuidado com importações circulares
      // import { logout } from '../redux/authSlice'; //
      // store.dispatch(logout());
      alert("Sessão expirada ou não autorizado. Faça login novamente.");
      // Evitar reload brusco se o roteador puder lidar com a mudança de estado
      if (window.location.pathname !== "/login") {
         window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;