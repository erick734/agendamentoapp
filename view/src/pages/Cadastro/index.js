import React, { useState, useEffect, useCallback } from "react";
import BuscaEndereco from "../BuscaEndereco";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../service/usuarioService";
import { empresaService } from "../../service/empresaService";
import styles from './index.module.css';

export default function Cadastro() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [perfil, setPerfil] = useState("p");
    const [endereco, setEndereco] = useState({ cep: "", localidade: "", uf: "" });
    const [empresas, setEmpresas] = useState([]);
    const [idEmpresa, setIdEmpresa] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erroGeral, setErroGeral] = useState("");
    const [carregandoEmpresas, setCarregandoEmpresas] = useState(false);

    const fetchEmpresas = useCallback(() => {
        if (perfil === 'm') {
            setCarregandoEmpresas(true);
            empresaService.getEmpresas()
                .then(data => setEmpresas(data || []))
                .catch(err => setErroGeral("Não foi possível carregar as clínicas."))
                .finally(() => setCarregandoEmpresas(false));
        }
    }, [perfil]);

    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);
    
    const handleTelefoneChange = (e) => {
        const valor = e.target.value.replace(/\D/g, "");
        const mascarado = valor
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
            .substring(0, 15);
        setTelefone(mascarado);
    };

    const cadastrarUsuario = async (e) => {
        e.preventDefault();
        setErroGeral("");
        if (perfil === 'm' && !idEmpresa) {
            alert("Por favor, selecione uma empresa para o perfil de médico.");
            return;
        }
        setCarregando(true);
        const payload = {
            usuario: email,
            email,
            senha,
            perfil,
            nome,
            sobrenome,
            telefone: telefone.replace(/\D/g, ""),
            cep: endereco.cep.replace(/\D/g, ""),
            localidade: endereco.localidade,
            uf: endereco.uf,
            idEmpresa: perfil === 'm' ? idEmpresa : null,
        };
        try {
            await usuarioService.cadastrar(payload);
            alert("Usuário cadastrado com sucesso!");
            navigate("/login");
        } catch (error) {
            setErroGeral(error.response?.data || "Erro ao cadastrar.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={`card ${styles.formCard}`}>
                <h2 className={styles.formTitle}>Crie sua Conta</h2>
                <p className={styles.formSubtitle}>É rápido e fácil.</p>

                <form onSubmit={cadastrarUsuario} className="mt-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">E-mail (será seu login)</label>
                            <input type="email" list="email-sugestoes" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" disabled={carregando}/>
                            <datalist id="email-sugestoes">
                                <option value={email.split('@')[0] + "@gmail.com"} />
                                <option value={email.split('@')[0] + "@hotmail.com"} />
                                <option value={email.split('@')[0] + "@outlook.com"} />
                            </datalist>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">Senha</label>
                            <input type="password" className="form-control" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} autoComplete="new-password" disabled={carregando}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Nome</label>
                            <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={carregando}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Sobrenome</label>
                            <input type="text" className="form-control" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} required disabled={carregando}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Telefone</label>
                            <input type="tel" className="form-control" placeholder="(XX) XXXXX-XXXX" value={telefone} onChange={handleTelefoneChange} required disabled={carregando}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Eu sou</label>
                            <select className="form-select" value={perfil} onChange={(e) => setPerfil(e.target.value)} required disabled={carregando}>
                                <option value="p">Paciente</option>
                                <option value="m">Médico</option>
                            </select>
                        </div>
                    </div>

                    {perfil === 'm' && (
                        <div className="mt-3">
                            <label className="form-label fw-bold">Clínica/Empresa</label>
                            <select className="form-select" value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)} required={perfil === 'm'} disabled={carregando || carregandoEmpresas}>
                                <option value="">{carregandoEmpresas ? "Carregando..." : "Selecione a clínica"}</option>
                                {empresas.map(empresa => (<option key={empresa.id} value={empresa.id}>{empresa.nome}</option>))}
                            </select>
                        </div>
                    )}
                    
                    <div className="mt-3">
                        <BuscaEndereco setEndereco={setEndereco} endereco={endereco} disabled={carregando} />
                    </div>
                    
                    <div className="row g-3 mt-1">
                        <div className="col-md-4">
                            <label className="form-label">CEP</label>
                            <input type="text" className="form-control" value={endereco.cep || ""} readOnly disabled />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label">Cidade</label>
                            <input type="text" className="form-control" value={endereco.localidade || ""} readOnly disabled />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">UF</label>
                            <input type="text" className="form-control" value={endereco.uf || ""} readOnly disabled />
                        </div>
                    </div>

                    {erroGeral && (<div className="alert alert-danger mt-3 text-center" role="alert">{erroGeral}</div>)}

                    <div className="d-grid mt-4 gap-2">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={carregando || (perfil === 'm' && !idEmpresa)}>
                            {carregando ? "Finalizando..." : "Finalizar Cadastro"}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/login")}>
                            Já tenho uma conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}