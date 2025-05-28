package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.domain.repository.ConsultaRepository;
import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    public List<Consulta> listarConsultas() {
        return consultaRepository.findAll();
    }

    public Optional<Consulta> buscarPorId(Long id) {
        return consultaRepository.findById(id);
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
}
