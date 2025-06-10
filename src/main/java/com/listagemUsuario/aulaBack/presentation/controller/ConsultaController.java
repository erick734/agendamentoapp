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
    public ResponseEntity<List<ConsultaResponse>> listarConsultas() {
        return ResponseEntity.ok(consultaService.listarConsultasParaUsuarioLogado());
    }

    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorMedico(@PathVariable Long idMedico) {
        return ResponseEntity.ok(consultaService.listarConsultasPorMedico(idMedico));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponse> buscarConsultaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.buscarPorIdFormatado(id));
    }

    @PostMapping
    public ResponseEntity<Consulta> criarConsulta(@RequestBody ConsultaRequest request) {
        return ResponseEntity.status(201).body(consultaService.salvarConsulta(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consulta> atualizarConsulta(@PathVariable Long id, @RequestBody ConsultaRequest request) {
        return ResponseEntity.ok(consultaService.atualizarConsulta(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConsulta(@PathVariable Long id) {
        consultaService.deletarConsulta(id);
        return ResponseEntity.noContent().build();
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