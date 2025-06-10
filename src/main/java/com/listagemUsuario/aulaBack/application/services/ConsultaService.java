package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaRequest;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaResponse;
import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import com.listagemUsuario.aulaBack.domain.repository.ConsultaRepository;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ConsultaResponse> listarConsultasParaUsuarioLogado() {
        Usuario usuarioLogado = getUsuarioLogado();
        List<Consulta> consultas;

        switch (usuarioLogado.getPerfil().toUpperCase()) {
            case "A":
                consultas = consultaRepository.findAll();
                break;
            case "M":
                consultas = consultaRepository.findByIdMedico(usuarioLogado.getId());
                break;
            case "P":
                consultas = consultaRepository.findByIdPaciente(usuarioLogado.getId());
                break;
            default:
                consultas = Collections.emptyList();
                break;
        }
        // Usa o método de conversão simples e seguro
        return consultas.stream()
                .map(this::convertToResponseIndividual)
                .collect(Collectors.toList());
    }

    public List<ConsultaResponse> listarConsultasPorMedico(Long idMedico) {
        return consultaRepository.findByIdMedico(idMedico).stream()
                .map(this::convertToResponseIndividual)
                .collect(Collectors.toList());
    }

    public ConsultaResponse buscarPorIdFormatado(Long id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada com o ID: " + id));
        validarAcessoConsulta(consulta);
        return convertToResponseIndividual(consulta);
    }

    public Consulta salvarConsulta(ConsultaRequest request) {
        Usuario pacienteLogado = getUsuarioLogado();
        if (!pacienteLogado.getPerfil().equalsIgnoreCase("A") && !pacienteLogado.getId().equals(request.getIdPaciente())) {
            throw new AccessDeniedException("Um paciente só pode marcar consultas para si mesmo.");
        }
        Consulta consulta = new Consulta();
        consulta.setDataHora(request.getDataHora());
        consulta.setDescricao(request.getDescricao());
        consulta.setIdPaciente(request.getIdPaciente());
        consulta.setIdMedico(request.getIdMedico());
        consulta.setStatus("AGUARDANDO");
        return consultaRepository.save(consulta);
    }

    public Consulta atualizarConsulta(Long id, ConsultaRequest request) {
        Usuario usuarioLogado = getUsuarioLogado();
        Consulta consultaExistente = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

        if (!consultaExistente.getIdPaciente().equals(usuarioLogado.getId()) && !usuarioLogado.getPerfil().equalsIgnoreCase("A")) {
            throw new AccessDeniedException("Você não tem permissão para editar esta consulta.");
        }
        List<String> statusPermitidos = Arrays.asList("AGUARDANDO", "APROVADA", "REJEITADA", "CANCELADA");
        if (!statusPermitidos.contains(consultaExistente.getStatus())) {
            throw new IllegalStateException("Esta consulta não pode mais ser editada.");
        }
        consultaExistente.setDataHora(request.getDataHora());
        consultaExistente.setDescricao(request.getDescricao());
        consultaExistente.setIdMedico(request.getIdMedico());
        consultaExistente.setStatus("AGUARDANDO");
        return consultaRepository.save(consultaExistente);
    }

    public void mudarStatusConsulta(Long id, String novoStatus) {
        Usuario medicoLogado = getUsuarioLogado();
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

        if (!medicoLogado.getPerfil().equalsIgnoreCase("A") && !consulta.getIdMedico().equals(medicoLogado.getId())) {
            throw new AccessDeniedException("Você não tem permissão para gerenciar esta consulta.");
        }
        if (!Arrays.asList("APROVADA", "CANCELADA").contains(novoStatus)) {
            throw new IllegalArgumentException("Status inválido.");
        }
        consulta.setStatus(novoStatus);
        consultaRepository.save(consulta);
    }

    public boolean deletarConsulta(Long id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException("Usuário não autenticado.");
        }
        return usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário da autenticação não encontrado."));
    }

    private void validarAcessoConsulta(Consulta consulta) {
        Usuario usuarioLogado = getUsuarioLogado();
        String perfil = usuarioLogado.getPerfil();
        Long usuarioId = usuarioLogado.getId();
        if (perfil.equalsIgnoreCase("A")) return;
        if (perfil.equalsIgnoreCase("P") && usuarioId.equals(consulta.getIdPaciente())) return;
        if (perfil.equalsIgnoreCase("M") && usuarioId.equals(consulta.getIdMedico())) return;
        throw new AccessDeniedException("Você não tem permissão para ver os detalhes desta consulta.");
    }

    private ConsultaResponse convertToResponseIndividual(Consulta consulta) {
        ConsultaResponse response = new ConsultaResponse();
        response.setId(consulta.getId());
        response.setDataHora(consulta.getDataHora());
        response.setDescricao(consulta.getDescricao());
        response.setStatus(consulta.getStatus());
        response.setIdPaciente(consulta.getIdPaciente());
        response.setIdMedico(consulta.getIdMedico());

        if (consulta.getIdPaciente() != null) {
            usuarioRepository.findById(consulta.getIdPaciente()).ifPresent(paciente -> {
                String nomeCompleto = paciente.getNome() + " " + (paciente.getSobrenome() != null ? paciente.getSobrenome() : "");
                response.setNomePaciente(nomeCompleto.trim());
            });
        }
        if (consulta.getIdMedico() != null) {
            usuarioRepository.findById(consulta.getIdMedico()).ifPresent(medico -> {
                String nomeCompleto = medico.getNome() + " " + (medico.getSobrenome() != null ? medico.getSobrenome() : "");
                response.setNomeMedico(nomeCompleto.trim());
            });
        }
        return response;
    }
}