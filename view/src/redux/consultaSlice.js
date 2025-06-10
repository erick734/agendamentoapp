import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { consultaService } from "../service/consultaService";

// Ação para a busca inicial de dados
export const fetchConsultas = createAsyncThunk(
  "consultas/fetchConsultas",
  async (_, { rejectWithValue }) => {
    try {
      const data = await consultaService.getMinhasConsultas();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erro ao buscar consultas.");
    }
  }
);

const consultaSlice = createSlice({
  name: "consultas",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  // ✨ LÓGICA DE ATUALIZAÇÃO MANUAL ✨
  reducers: {
    // Ação para atualizar o status de uma consulta específica na lista
    updateConsultaStatus: (state, action) => {
      const { id, novoStatus } = action.payload;
      const consultaExistente = state.items.find(item => item.id === id);
      if (consultaExistente) {
        consultaExistente.status = novoStatus;
      }
    },
    // Ação para remover uma consulta da lista após ser deletada
    removeConsulta: (state, action) => {
      const idParaRemover = action.payload;
      state.items = state.items.filter(item => item.id !== idParaRemover);
    },
    // Adiciona uma nova consulta à lista sem precisar buscar tudo de novo
     addConsulta: (state, action) => {
      state.items.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsultas.pending, (state) => {
        state.status = "loading";
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

// Exportando as novas ações
export const { updateConsultaStatus, removeConsulta, addConsulta } = consultaSlice.actions;

export const selectAllConsultas = (state) => state.consultas.items;
export const selectConsultasStatus = (state) => state.consultas.status;
export const selectConsultasError = (state) => state.consultas.error;

export default consultaSlice.reducer;