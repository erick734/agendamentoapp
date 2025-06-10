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

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ConsultaResponse> listarTodasConsultas() {
        return formatarListaDeConsultas(consultaRepository.findAll());
    }

    public List<ConsultaResponse> listarConsultasPorPaciente(Long idPaciente) {
        return formatarListaDeConsultas(consultaRepository.findByIdPaciente(idPaciente));
    }

    public List<ConsultaResponse> listarConsultasPorMedico(Long idMedico) {
        return formatarListaDeConsultas(consultaRepository.findByIdMedico(idMedico));
    }

    public ConsultaResponse buscarPorIdFormatado(Long id) {
        return consultaRepository.findById(id)
                .map(this::convertToResponseComNomes)
                .orElse(null);
    }

    public Consulta salvarConsulta(ConsultaRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario pacienteLogado = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        if (!pacienteLogado.getId().equals(request.getIdPaciente())) {
            throw new AccessDeniedException("Um paciente não pode marcar consultas para outros pacientes.");
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario pacienteLogado = usuarioRepository.findByEmail(authentication.getName()).orElseThrow();

        Consulta consultaExistente = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

        if (!consultaExistente.getIdPaciente().equals(pacienteLogado.getId())) {
            throw new AccessDeniedException("Você não tem permissão para editar esta consulta.");
        }

        List<String> statusPermitidos = Arrays.asList("AGUARDANDO", "APROVADA", "REJEITADA", "CANCELADA");

        if (!statusPermitidos.contains(consultaExistente.getStatus())) {
            throw new IllegalStateException("Esta consulta não pode mais ser editada pois já foi finalizada.");
        }

        consultaExistente.setDataHora(request.getDataHora());
        consultaExistente.setDescricao(request.getDescricao());
        consultaExistente.setIdMedico(request.getIdMedico());
        consultaExistente.setStatus("AGUARDANDO");

        return consultaRepository.save(consultaExistente);
    }

    public boolean deletarConsulta(Long id) {
        if (consultaRepository.existsById(id)) {
            consultaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void mudarStatusConsulta(Long id, String novoStatus) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario medicoLogado = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

        if (!consulta.getIdMedico().equals(medicoLogado.getId())) {
            throw new AccessDeniedException("Você não tem permissão para gerenciar esta consulta.");
        }

        if (!Arrays.asList("APROVADA", "CANCELADA").contains(novoStatus)) {
            throw new IllegalArgumentException("Status inválido.");
        }

        consulta.setStatus(novoStatus);
        consultaRepository.save(consulta);
    }

    private List<ConsultaResponse> formatarListaDeConsultas(List<Consulta> consultas) {
        if (consultas.isEmpty()) {
            return Collections.emptyList();
        }
        Set<Long> idsUsuarios = consultas.stream()
                .flatMap(c -> Stream.of(c.getIdPaciente(), c.getIdMedico()))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, Usuario> mapaUsuarios = usuarioRepository.findAllById(idsUsuarios).stream()
                .collect(Collectors.toMap(Usuario::getId, Function.identity()));
        return consultas.stream()
                .map(consulta -> convertToResponseComNomes(consulta, mapaUsuarios))
                .collect(Collectors.toList());
    }

    private ConsultaResponse convertToResponseComNomes(Consulta consulta, Map<Long, Usuario> mapaUsuarios) {
        ConsultaResponse response = new ConsultaResponse();
        response.setId(consulta.getId());
        response.setDataHora(consulta.getDataHora());
        response.setDescricao(consulta.getDescricao());
        response.setStatus(consulta.getStatus());

        Usuario paciente = mapaUsuarios.get(consulta.getIdPaciente());
        if (paciente != null) {
            response.setIdPaciente(paciente.getId());
            response.setNomePaciente(paciente.getNome() + " " + (paciente.getSobrenome() != null ? paciente.getSobrenome() : ""));
        }
        Usuario medico = mapaUsuarios.get(consulta.getIdMedico());
        if (medico != null) {
            response.setIdMedico(medico.getId());
            response.setNomeMedico(medico.getNome() + " " + (medico.getSobrenome() != null ? medico.getSobrenome() : ""));
        }
        return response;
    }

    private ConsultaResponse convertToResponseComNomes(Consulta consulta) {
        Map<Long, Usuario> mapa = usuarioRepository.findAllById(List.of(consulta.getIdPaciente(), consulta.getIdMedico()))
                .stream().collect(Collectors.toMap(Usuario::getId, Function.identity()));
        return convertToResponseComNomes(consulta, mapa);
    }
}