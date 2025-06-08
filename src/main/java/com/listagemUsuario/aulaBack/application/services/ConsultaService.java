package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.domain.repository.ConsultaRepository;
import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaResponse;
import com.listagemUsuario.aulaBack.domain.entities.Usuario; // Certifique-se que sua entidade Usuario existe
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository; // E seu repositório também

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ConsultaResponse> listarConsultasFormatado() {
        List<Consulta> consultas = consultaRepository.findAll();
        return consultas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ConsultaResponse buscarPorIdFormatado(Long id) {
        return consultaRepository.findById(id)
                .map(this::convertToResponse)
                .orElse(null);
    }

    private ConsultaResponse convertToResponse(Consulta consulta) {
        ConsultaResponse response = new ConsultaResponse();
        response.setId(consulta.getId());
        response.setDataHora(consulta.getDataHora());
        response.setDescricao(consulta.getDescricao());

        if (consulta.getIdPaciente() != null) {
            Optional<Usuario> pacienteOpt = usuarioRepository.findById(consulta.getIdPaciente());
            if (pacienteOpt.isPresent()) {
                Usuario paciente = pacienteOpt.get();
                response.setIdPaciente(paciente.getId());
                response.setNomePaciente(paciente.getNome() + " " + (paciente.getSobrenome() != null ? paciente.getSobrenome() : ""));
            } else {
                response.setNomePaciente("Paciente não encontrado"); // Ou alguma outra lógica
            }
        }

        if (consulta.getIdMedico() != null) {
            Optional<Usuario> medicoOpt = usuarioRepository.findById(consulta.getIdMedico());
            if (medicoOpt.isPresent()) {
                Usuario medico = medicoOpt.get();
                response.setIdMedico(medico.getId());
                response.setNomeMedico(medico.getNome() + " " + (medico.getSobrenome() != null ? medico.getSobrenome() : ""));
            } else {
                response.setNomeMedico("Médico não encontrado");
            }
        }

        return response;
    }

    public Consulta salvarConsulta(ConsultaRequest request) {
        Consulta consulta = new Consulta();
        consulta.setDataHora(request.getDataHora());
        consulta.setDescricao(request.getDescricao());
        consulta.setIdPaciente(request.getIdPaciente());
        consulta.setIdMedico(request.getIdMedico());
        return consultaRepository.save(consulta);
    }

    public Consulta atualizarConsulta(Long id, ConsultaRequest request) {
        Optional<Consulta> consultaExistente = consultaRepository.findById(id);
        if (consultaExistente.isPresent()) {
            Consulta consulta = consultaExistente.get();
            consulta.setDataHora(request.getDataHora());
            consulta.setDescricao(request.getDescricao());
            consulta.setIdPaciente(request.getIdPaciente());
            consulta.setIdMedico(request.getIdMedico());
            // Se tiver status, atualize-o também se necessário
            return consultaRepository.save(consulta);
        }
        return null;
    }

    public boolean deletarConsulta(Long id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Consulta> listarConsultas() {
        return consultaRepository.findAll();
    }

    public Optional<Consulta> buscarPorId(Long id) {
        return consultaRepository.findById(id);
    }
}