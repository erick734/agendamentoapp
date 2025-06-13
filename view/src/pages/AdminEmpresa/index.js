import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { empresaService } from '../../service/empresaService';
import styles from './index.module.css';

export default function AdminEmpresas() {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);

    const buscarEmpresas = useCallback(async () => {
        setStatus('loading');
        try {
            const data = await empresaService.getEmpresas();
            setEmpresas(Array.isArray(data) ? data : []);
            setStatus('succeeded');
        } catch (err) {
            setError('Não foi possível carregar as empresas.');
            setStatus('failed');
        }
    }, []);

    useEffect(() => {
        buscarEmpresas();
    }, [buscarEmpresas]);

    const renderContent = () => {
        if (status === 'loading') {
            return <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
        }
        if (status === 'failed') {
            return <div className="alert alert-danger">{error}</div>;
        }
        if (empresas.length === 0) {
            return <div className="text-center p-4 bg-light">Nenhuma empresa cadastrada.</div>;
        }
        return (
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome da Empresa</th>
                        <th>CNPJ</th>
                        <th>Localidade</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map(empresa => (
                        <tr key={empresa.id}>
                            <td>{empresa.id}</td>
                            <td>{empresa.nome}</td>
                            <td>{empresa.cnpj}</td>
                            <td>{`${empresa.localidade} - ${empresa.uf}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container py-4">
            <div className={styles.pageCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Gerenciamento de Empresas</h1>
                    <button className="btn btn-primary" onClick={() => navigate('/cadastro-empresa')}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Cadastrar Nova Empresa
                    </button>
                </div>
                <div className="mt-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}