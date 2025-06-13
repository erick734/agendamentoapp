package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaRequest;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaResponse;
import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import com.listagemUsuario.aulaBack.domain.repository.ConsultaRepository;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<ConsultaResponse> listarTodas() {
        return formatarListaDeConsultas(consultaRepository.findAll());
    }

    public List<ConsultaResponse> buscarPorIdMedico(Long idMedico) {
        return formatarListaDeConsultas(consultaRepository.findByIdMedico(idMedico));
    }

    public List<ConsultaResponse> buscarPorIdPaciente(Long idPaciente) {
        return formatarListaDeConsultas(consultaRepository.findByIdPaciente(idPaciente));
    }

    public ConsultaResponse buscarPorIdFormatado(Long id) {
        return consultaRepository.findById(id)
                .map(this::convertToResponseIndividual)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada com o ID: " + id));
    }

    public Consulta criarConsulta(ConsultaRequest request) {
        Consulta consulta = new Consulta();
        consulta.setDataHora(request.getDataHora());
        consulta.setDescricao(request.getDescricao());
        consulta.setIdPaciente(request.getIdPaciente());
        consulta.setIdMedico(request.getIdMedico());
        consulta.setStatus("AGUARDANDO");
        return consultaRepository.save(consulta);
    }

    public Consulta atualizarConsulta(Long id, ConsultaRequest request) {
        Consulta existente = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada com o ID: " + id));

        existente.setDataHora(request.getDataHora());
        existente.setDescricao(request.getDescricao());
        existente.setIdMedico(request.getIdMedico());
        existente.setStatus("AGUARDANDO");
        return consultaRepository.save(existente);
    }

    public void deletarConsulta(Long id) {
        if (!consultaRepository.existsById(id)) {
            throw new RuntimeException("Consulta não encontrada para deleção com o ID: " + id);
        }
        consultaRepository.deleteById(id);
    }

    public Consulta aprovarConsulta(Long id) {
        Consulta consulta = consultaRepository.findById(id).orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        consulta.setStatus("APROVADA");
        return consultaRepository.save(consulta);
    }

    public Consulta cancelarConsulta(Long id) {
        Consulta consulta = consultaRepository.findById(id).orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        consulta.setStatus("CANCELADA");
        return consultaRepository.save(consulta);
    }

    private List<ConsultaResponse> formatarListaDeConsultas(List<Consulta> consultas) {
        if (consultas.isEmpty()) return Collections.emptyList();

        Set<Long> idsUsuarios = consultas.stream()
                .flatMap(c -> Stream.of(c.getIdPaciente(), c.getIdMedico()))
                .filter(Objects::nonNull).collect(Collectors.toSet());

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

    private ConsultaResponse convertToResponseIndividual(Consulta consulta) {
        Map<Long, Usuario> mapa = new HashMap<>();
        if (consulta.getIdPaciente() != null) {
            usuarioRepository.findById(consulta.getIdPaciente()).ifPresent(u -> mapa.put(u.getId(), u));
        }
        if (consulta.getIdMedico() != null) {
            usuarioRepository.findById(consulta.getIdMedico()).ifPresent(u -> mapa.put(u.getId(), u));
        }
        return convertToResponseComNomes(consulta, mapa);
    }
}