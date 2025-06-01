import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/api";

export const fetchConsultas = createAsyncThunk(
  "consultas/fetchConsultas",
  async (_, { getState }) => {
    const { id: userId, perfil: userPerfil } = getState().auth;

    let url = "/consulta";

    if (userPerfil === "p") {
      url += `?pacienteId=${userId}`;
    } else if (userPerfil === "m") {
      url += `?medicoId=${userId}`;
    }

    const response = await api.get(url);
    return response.data;
  }
);

const consultaSlice = createSlice({
  name: "consultas",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsultas.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConsultas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchConsultas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllConsultas = (state) => state.consultas.items;
export const selectConsultasStatus = (state) => state.consultas.status;
export const selectConsultasError = (state) => state.consultas.error;

export default consultaSlice.reducer;