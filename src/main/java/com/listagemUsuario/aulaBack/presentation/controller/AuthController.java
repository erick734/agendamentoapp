package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginResponse;
import com.listagemUsuario.aulaBack.application.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
