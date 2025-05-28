package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginRequest;
import com.listagemUsuario.aulaBack.application.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Rota relacionada a autenticação nas requisições.")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping
    @Operation(summary = "Login do usuário", description = "Rota para autenticar um usuário com JWT token.")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Chama o serviço de autenticação que retorna o ResponseEntity (com token ou erro)
            return authService.login(loginRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro na autenticação: " + e.getMessage());
        }
    }
}
