import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    usuario: null,
    id: null,
    perfil: null,
    nome: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.usuario = action.payload.usuario;
      state.id = action.payload.id;
      state.perfil = action.payload.perfil;
      state.nome = action.payload.nome;
    },
    logout: (state) => {
      state.token = null;
      state.usuario = null;
      state.id = null;
      state.perfil = null;
      state.nome = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectToken = (state) => state.auth.token;
export const selectUsuario = (state) => state.auth.usuario;
export const selectPerfil = (state) => state.auth.perfil;
export const selectNome = (state) => state.auth.nome;
export const selectId = (state) => state.auth.id;
export const selectIsAuthenticated = (state) => !!state.auth.token;
