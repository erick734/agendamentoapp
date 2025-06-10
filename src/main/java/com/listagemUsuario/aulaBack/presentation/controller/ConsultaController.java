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
        return ResponseEntity.ok(consultaService.listarTodasConsultas());
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorPaciente(@PathVariable Long idPaciente) {
        return ResponseEntity.ok(consultaService.listarConsultasPorPaciente(idPaciente));
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorMedico(@PathVariable Long idMedico) {
        return ResponseEntity.ok(consultaService.listarConsultasPorMedico(idMedico));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponse> buscarConsultaPorId(@PathVariable Long id) {
        ConsultaResponse response = consultaService.buscarPorIdFormatado(id);
        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Consulta> criarConsulta(@RequestBody ConsultaRequest request) {
        Consulta novaConsulta = consultaService.salvarConsulta(request);
        return ResponseEntity.status(201).body(novaConsulta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consulta> atualizarConsulta(@PathVariable Long id, @RequestBody ConsultaRequest request) {
        Consulta consultaAtualizada = consultaService.atualizarConsulta(id, request);
        if (consultaAtualizada != null) {
            return ResponseEntity.ok(consultaAtualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConsulta(@PathVariable Long id) {
        boolean deletado = consultaService.deletarConsulta(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Void> aprovarConsulta(@PathVariable Long id) {
        consultaService.mudarStatusConsulta(id, "APROVADA");
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarConsulta(@PathVariable Long id) {
        consultaService.mudarStatusConsulta(id, "CANCELADA");
        return ResponseEntity.ok().build();
    }
}