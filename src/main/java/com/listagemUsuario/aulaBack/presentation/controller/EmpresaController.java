package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.empresa.EmpresaRequest;
import com.listagemUsuario.aulaBack.application.services.EmpresaService;
import com.listagemUsuario.aulaBack.domain.entities.Empresa;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/empresas")
@Tag(name = "Empresas", description = "Endpoints para gerenciamento de empresas/clínicas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping
    @Operation(summary = "Listar Todas as Empresas", description = "Retorna uma lista com todas as empresas cadastradas. Endpoint público para ser usado no formulário de cadastro de médicos.")
    public ResponseEntity<List<Empresa>> listarEmpresas() {
        return ResponseEntity.ok(empresaService.listarEmpresas());
    }

    @PostMapping
    @Operation(summary = "Criar Nova Empresa (Admin)", description = "Permite que um Administrador cadastre uma nova empresa/clínica no sistema.")
    public ResponseEntity<?> criarEmpresa(@RequestBody EmpresaRequest request) {
        try {
            Empresa empresaSalva = empresaService.criarEmpresa(request);
            return ResponseEntity.status(201).body(empresaSalva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}