import axios from "axios";

const login = async(loginRequest) =>{
    const res = await api.post("auth/login",loginRequest);
    return res.data;
};

export const authService = {login};