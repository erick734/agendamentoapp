import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const authService = {
  login: async (data) => {
    const response = await API.post("/login", data);
    return response.data;
  },
};
