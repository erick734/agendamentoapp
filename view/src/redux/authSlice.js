import { createSlice } from "@reduxjs/toolkit";

const loadAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    const id = localStorage.getItem("authId");

    if (!token || !user || !id) {
      return {
        token: null,
        usuario: null,
        id: null,
        isAuthenticated: false
      };
    }

    return {
      token: JSON.parse(token),
      usuario: JSON.parse(user),
      id: JSON.parse(id),
      isAuthenticated: true
    };
  } catch (e) {
    console.warn("Erro ao carregar auth do localStorage", e);
    return {
      token: null,
      usuario: null,
      id: null,
      isAuthenticated: false
    };
  }
};

const initialState = loadAuthFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { token, usuario, id } = action.payload;
      state.token = token;
      state.usuario = usuario;
      state.id = id;
      state.isAuthenticated = true;

      localStorage.setItem("authToken", JSON.stringify(token));
      localStorage.setItem("authUser", JSON.stringify(usuario));
      localStorage.setItem("authId", JSON.stringify(id));
    },
    logout: (state) => {
      state.token = null;
      state.usuario = null;
      state.id = null;
      state.isAuthenticated = false;

      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authId");
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectUsuario = (state) => state.auth.usuario;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
