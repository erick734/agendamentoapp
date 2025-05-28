package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.LoginResponse;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ResponseEntity<?> login(LoginRequest loginRequest) throws Exception {
        Usuario usuarioSalvo = usuarioRepository.findByEmail(loginRequest.email()).orElse(null);

        if (usuarioSalvo != null) {
            boolean senhaCorreta = usuarioSalvo.getSenha().equals(loginRequest.senha());

            if (senhaCorreta) {
                String token = tokenService.gerarToken(loginRequest);

                LoginResponse resposta = new LoginResponse(
                        usuarioSalvo.getId(),
                        token,
                        usuarioSalvo.getNome()
                );

                return ResponseEntity.ok(resposta);
            }
            throw new RuntimeException("Senha incorreta");
        }
        throw new RuntimeException("Usuário não encontrado");
    }
}
