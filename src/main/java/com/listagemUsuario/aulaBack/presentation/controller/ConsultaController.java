package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaRequest;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaResponse;
import com.listagemUsuario.aulaBack.application.services.ConsultaService;
import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @GetMapping
    public ResponseEntity<List<ConsultaResponse>> listarTodasConsultas() {
        List<ConsultaResponse> response = consultaService.listarTodas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorPaciente(@PathVariable Long idPaciente) {
        List<ConsultaResponse> response = consultaService.buscarPorIdPaciente(idPaciente);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorMedico(@PathVariable Long idMedico) {
        List<ConsultaResponse> response = consultaService.buscarPorIdMedico(idMedico);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponse> buscarConsultaPorId(@PathVariable Long id) {
        ConsultaResponse response = consultaService.buscarPorIdFormatado(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Consulta> criarConsulta(@RequestBody ConsultaRequest request) {
        Consulta novaConsulta = consultaService.criarConsulta(request);
        return ResponseEntity.status(201).body(novaConsulta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consulta> atualizarConsulta(@PathVariable Long id, @RequestBody ConsultaRequest request) {
        Consulta consultaAtualizada = consultaService.atualizarConsulta(id, request);
        return ResponseEntity.ok(consultaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConsulta(@PathVariable Long id) {
        consultaService.deletarConsulta(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Consulta> aprovarConsulta(@PathVariable Long id) {
        Consulta consultaAprovada = consultaService.aprovarConsulta(id);
        return ResponseEntity.ok(consultaAprovada);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Consulta> cancelarConsulta(@PathVariable Long id) {
        Consulta consultaCancelada = consultaService.cancelarConsulta(id);
        return ResponseEntity.ok(consultaCancelada);
    }
}