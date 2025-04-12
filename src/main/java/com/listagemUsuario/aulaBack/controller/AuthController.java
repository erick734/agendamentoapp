package com.listagemUsuario.aulaBack.controller;

import com.listagemUsuario.aulaBack.objetct.LoginRequest;
import com.listagemUsuario.aulaBack.services.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Rota relacionada a autenticação nas requisições.")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @PostMapping
    @Operation(summary = "Login do usuário", description = "Rota para autenticar um usuário com JWT token.")
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        var resultGerarToken = tokenService.gerarToken(loginRequest);
        return ResponseEntity.ok(resultGerarToken);
    }

}