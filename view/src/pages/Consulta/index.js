import React, { useEffect, useState, useCallback } from "react";
import AgendamentoConsulta from "../AgendamentoConsulta";
import axios from "axios";
import api from "../../service/api";

const baseURL = "http://localhost:8080";

const getToken = () => localStorage.getItem("authToken"); //ALTERAR PRA USAR REDUX
const getUsuario = () => JSON.parse(localStorage.getItem("authUser"));

export default function Consulta() {
  const [usuario, setUsuario] = useState(getUsuario());
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);

  const carregarConsultas = useCallback(async () => {
    const token = getToken();
    if (!token || !usuario) {
      setErro("Usuário não autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get(`${baseURL}/consulta`, config);
      const consultasBase = response.data;
      let consultasFiltradas = [];

      if (usuario.perfil === "p") {
        consultasFiltradas = consultasBase.filter(
          (c) => c.usuarioPacienteId === usuario.id
        );
      } else if (usuario.perfil === "m") {
        consultasFiltradas = consultasBase.filter(
          (c) => c.usuarioMedicoId === usuario.id
        );
      } else if (usuario.perfil === "a") {
        consultasFiltradas = consultasBase;
      }

      const consultasComDetalhes = await Promise.all(
        consultasFiltradas.map(async (consulta) => {
          let medicoData = null;
          let pacienteData = null;

          try {
            if (consulta.usuarioMedicoId) {
              const medicoResponse = await axios.get(
                `${baseURL}/usuario/${consulta.usuarioMedicoId}`,
                config
              );
              medicoData = medicoResponse.data;
            }
          } catch (errMed) {
            console.warn(
              `Erro ao buscar médico ${consulta.usuarioMedicoId}:`,
              errMed.message
            );
          }

          try {
            if (consulta.usuarioPacienteId) {
              const pacienteResponse = await axios.get(
                `${baseURL}/usuario/${consulta.usuarioPacienteId}`,
                config
              );
              pacienteData = pacienteResponse.data;
            }
          } catch (errPac) {
            console.warn(
              `Erro ao buscar paciente ${consulta.usuarioPacienteId}:`,
              errPac.message
            );
          }

          return {
            ...consulta,
            nomeMedico: medicoData
              ? `${medicoData.nome} ${medicoData.sobrenome || ""}`.trim()
              : "Médico Indisponível",
            nomePaciente: pacienteData
              ? `${pacienteData.nome} ${pacienteData.sobrenome || ""}`.trim()
              : "Paciente Indisponível",
          };
        })
      );

      setConsultas(consultasComDetalhes);
    } catch (error) {
      console.error(
        "Erro ao carregar consultas:",
        error.response ? error.response.data : error.message
      );
      setErro(
        `Erro ao carregar consultas: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      carregarConsultas();
    } else {
      setConsultas([]);
      setLoading(false);
      setErro(null);
    }
  }, [usuario, carregarConsultas]);

  const atualizarConsultas = useCallback(() => {
    if (usuario) {
      carregarConsultas();
    }
    setConsultaSelecionada(null);
  }, [usuario, carregarConsultas]);

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold mb-1">
        Bem-vindo, {usuario?.nome || "Usuário"}!
      </h1>

      <div className="card shadow-sm p-4">
      </div>

      {consultaSelecionada && (
        <AgendamentoConsulta
          consulta={consultaSelecionada}
          onClose={() => setConsultaSelecionada(null)}
          onAgendamentoRealizado={atualizarConsultas}
        />
      )}
    </div>
  );
}
