import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import consultaReducer from "./consultaSlice";
import api from "../service/api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    consultas: consultaReducer,
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && !config.url.includes("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default store;