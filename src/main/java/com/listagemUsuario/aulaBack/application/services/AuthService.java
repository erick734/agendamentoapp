package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginResponse;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        Usuario usuario = usuarioRepository.findByUsuarioIgnoreCase(loginRequest.usuario())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (!usuario.getSenha().equals(loginRequest.senha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta");
        }

        String token = tokenService.gerarToken(usuario);

        return new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getPerfil(),
                token
        );
    }
}
