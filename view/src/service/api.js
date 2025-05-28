import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const publicPaths = ["/login", "/auth/login", "/usuario", "/cadastro"];
    const isPublic = publicPaths.some((path) => config.url.endsWith(path));

    if (!isPublic) {
      const tokenItem = localStorage.getItem("authToken");
      if (tokenItem) {
        const token = JSON.parse(tokenItem);
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;