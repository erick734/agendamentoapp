package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaRequest;
import com.listagemUsuario.aulaBack.application.objetct.consulta.ConsultaResponse;
import com.listagemUsuario.aulaBack.application.services.ConsultaService;
import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/consultas")
@Tag(name = "Consultas", description = "Endpoints para gerenciamento de consultas")
@SecurityRequirement(name = "bearerAuth")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @GetMapping
    @Operation(summary = "Listar TODAS as Consultas (Acesso de Admin)", description = "Retorna uma lista de todas as consultas no sistema. O front-end deve chamar esta rota apenas para usuários com perfil de Admin.")
    public ResponseEntity<List<ConsultaResponse>> listarTodasConsultas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/paciente/{idPaciente}")
    @Operation(summary = "Listar Consultas por Paciente", description = "Retorna todas as consultas de um paciente específico. O front-end deve chamar esta rota para o perfil de Paciente.")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorPaciente(@PathVariable Long idPaciente) {
        return ResponseEntity.ok(consultaService.buscarPorIdPaciente(idPaciente));
    }

    @GetMapping("/medico/{idMedico}")
    @Operation(summary = "Listar Consultas por Médico", description = "Retorna todas as consultas de um médico específico. O front-end deve chamar esta rota para o perfil de Médico e para a tela de agendamento.")
    public ResponseEntity<List<ConsultaResponse>> listarConsultasPorMedico(@PathVariable Long idMedico) {
        return ResponseEntity.ok(consultaService.buscarPorIdMedico(idMedico));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Consulta por ID", description = "Retorna os detalhes de uma única consulta.")
    public ResponseEntity<ConsultaResponse> buscarConsultaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.buscarPorIdFormatado(id));
    }

    @PostMapping
    @Operation(summary = "Criar Nova Consulta", description = "Cria um novo agendamento de consulta.")
    public ResponseEntity<Consulta> criarConsulta(@RequestBody ConsultaRequest request) {
        return ResponseEntity.status(201).body(consultaService.criarConsulta(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Consulta", description = "Edita uma consulta existente.")
    public ResponseEntity<Consulta> atualizarConsulta(@PathVariable Long id, @RequestBody ConsultaRequest request) {
        return ResponseEntity.ok(consultaService.atualizarConsulta(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Consulta", description = "Deleta uma consulta.")
    public ResponseEntity<Void> deletarConsulta(@PathVariable Long id) {
        consultaService.deletarConsulta(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/aprovar")
    @Operation(summary = "Aprovar Consulta", description = "Muda o status para 'APROVADA'.")
    public ResponseEntity<Consulta> aprovarConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.aprovarConsulta(id));
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar Consulta", description = "Muda o status para 'CANCELADA'.")
    public ResponseEntity<Consulta> cancelarConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.cancelarConsulta(id));
    }
}