import React, { useState } from "react";
import axios from "axios";
import BuscaEndereco from "../BuscaEndereco";
import { useNavigate } from "react-router-dom";


export default function Cadastro() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [endereco, setEndereco] = useState(null);
    const navigate = useNavigate();


    async function cadastrarUsuario(e) {
        e.preventDefault();
        try {
            if (!usuario || !senha || !endereco) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const novoUsuario = {
                usuario,
                senha,
                endereco,
            };

            await axios.post("http://localhost:3001/usuario", novoUsuario);
            alert("Usuário cadastrado com sucesso!");

            navigate("/login");
        } catch (error) {
            alert("Erro ao cadastrar o usuário!");
        }
    }

    return (
        <div className="container text-center py-4">
            <h1 className="fw-bold">Cadastramento de Usuario</h1>

            <form onSubmit={cadastrarUsuario} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Usuário</label>
                    <input
                        type="text"
                        className="form-control"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>
                <BuscaEndereco setEndereco={setEndereco} />
                <button type="submit" className="btn btn-primary mt-3 w-100">
                    cadastrar
                </button>
            </form>
            <button
                type="button"
                className="btn btn-secondary mt-3 w-100"
                onClick={() => navigate("/login")}
            >
                Voltar
            </button>
        </div>
    );
}