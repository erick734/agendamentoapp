import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../../service/empresaService";
import BuscaEndereco from "../../pages/BuscaEndereco";
import styles from './index.module.css';

export default function CadastroEmpresa() {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [endereco, setEndereco] = useState({ cep: "", localidade: "", uf: "" });
    const [carregando, setCarregando] = useState(false);
    const [erroGeral, setErroGeral] = useState("");
    const [erroCnpj, setErroCnpj] = useState("");

    const limparFormulario = () => {
      setNome("");
      setCnpj("");
      setEndereco({ cep: "", localidade: "", uf: "" });
      setErroCnpj("");
    };

    const handleCnpjChange = useCallback((e) => {
        const valor = e.target.value;
        const cnpjLimpo = valor.replace(/\D/g, "");

        const cnpjMascarado = cnpjLimpo
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 18);

        setCnpj(cnpjMascarado);

        if (cnpjLimpo.length > 0 && cnpjLimpo.length < 14) {
            setErroCnpj("O CNPJ deve conter 14 dígitos.");
        } else {
            setErroCnpj("");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (erroCnpj) {
            setErroGeral("Por favor, corrija os erros no formulário antes de continuar.");
            return;
        }

        setCarregando(true);
        setErroGeral("");
        try {
            const payload = { 
                nome, 
                cnpj: cnpj.replace(/\D/g, ""),
                cep: endereco.cep, 
                localidade: endereco.localidade, 
                uf: endereco.uf 
            };
            await empresaService.criarEmpresa(payload);
            alert("Empresa cadastrada com sucesso!");
            limparFormulario();
        } catch (error) {
            setErroGeral(error.response?.data || "Erro ao cadastrar empresa. Verifique se o CNPJ já não existe.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="container py-5">
            <div className={`card shadow-lg p-4 mx-auto ${styles.formContainer}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-center fw-bold mb-0">Cadastro de Empresa</h2>
                    <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => navigate("/admin/empresas")}
                    >
                        <i className="bi bi-arrow-left"></i> Voltar
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nome da Empresa</label>
                        <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required disabled={carregando} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">CNPJ</label>
                        <input 
                            type="text" 
                            className={`form-control ${erroCnpj ? 'is-invalid' : ''}`} 
                            value={cnpj} 
                            onChange={handleCnpjChange} 
                            maxLength="18"
                            required 
                            disabled={carregando}
                        />
                        {erroCnpj && <div className="invalid-feedback">{erroCnpj}</div>}
                    </div>
                    <BuscaEndereco setEndereco={setEndereco} endereco={endereco} disabled={carregando} />
                    <div className="row mt-3">
                        <div className="col-md-4"><label className="form-label">CEP</label><input type="text" className="form-control" value={endereco.cep || ''} readOnly disabled /></div>
                        <div className="col-md-5"><label className="form-label">Cidade</label><input type="text" className="form-control" value={endereco.localidade || ''} readOnly disabled /></div>
                        <div className="col-md-3"><label className="form-label">UF</label><input type="text" className="form-control" value={endereco.uf || ''} readOnly disabled /></div>
                    </div>
                    {erroGeral && <div className="alert alert-danger mt-3">{erroGeral}</div>}
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary" disabled={carregando || !!erroCnpj}>
                            {carregando ? "Cadastrando..." : "Cadastrar Empresa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}