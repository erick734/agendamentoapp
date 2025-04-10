package com.listagemUsuario.aulaBack.controller;

import com.listagemUsuario.aulaBack.models.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "autenticação de usuario")
public class AuthController {

    @PostMapping
    @Operation(summary = "Login do usuario", description = "retorna JWT token valido")
    public ResponseEntity<?> login(Usuario usuario){

        GerarUmToken
        return ResponseEntity.ok(usuario);
    }
}
