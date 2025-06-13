import apiClient from "./api";

const criarEmpresa = async (empresaData) => {
  try {
    const response = await apiClient.post("/empresas", empresaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    throw error;
  }
};

const getEmpresas = async () => {
    try {
        const response = await apiClient.get("/empresas");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        throw error;
    }
}

export const empresaService = {
  criarEmpresa,
  getEmpresas,
};