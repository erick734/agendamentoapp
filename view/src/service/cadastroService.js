import api from "./api";

const cadastrar = async(cadastroRequest) =>{
    const res = await api.post("usuario",cadastroRequest);
    return res.data;
};

export const authService = {cadastrar, consultar};