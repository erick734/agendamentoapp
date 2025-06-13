package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.empresa.EmpresaRequest;
import com.listagemUsuario.aulaBack.application.services.EmpresaService;
import com.listagemUsuario.aulaBack.domain.entities.Empresa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping
    public ResponseEntity<Empresa> criarEmpresa(@RequestBody EmpresaRequest request) {
        try {
            Empresa empresaSalva = empresaService.criarEmpresa(request);
            return ResponseEntity.status(201).body(empresaSalva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}