package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginResponse;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    public LoginResponse login(LoginRequest request) {
        // Usa o método com a query corrigida para buscar por e-mail e senha em texto puro
        var usuario = usuarioRepository.findByEmailAndSenha(request.usuario(), request.senha())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos."));

        var token = tokenService.gerarToken(usuario);

        return new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getPerfil(),
                token
        );
    }
}