package com.listagemUsuario.aulaBack.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
// import com.listagemUsuario.aulaBack.domain.repository.TokenRepository; // Exemplo tem, mas não usa no TokenService
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${spring.expiration_time}") // Exemplo: 5 (interpretado como dias)
    private Long expirationTime;

    @Value("${spring.secretkey}")
    private String secret;

    @Value("${spring.emissor}")
    private String emissor;

    // Exemplo tem @Autowired TokenRepository, mas não o usa nos métodos fornecidos.
    // Se não for usar, pode omitir.
    // @Autowired
    // private TokenRepository tokenRepository;

    public String gerarToken(Usuario loginRequest) { // Usa LoginRequest para pegar o 'usuario'
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(loginRequest.getUsuario()) // USA O CAMPO 'usuario' DO LOGIN REQUEST
                    .withExpiresAt(this.gerarDataExpiracao())
                    .sign(algorithm);
            return token;
        } catch (Exception e) {
            // Logar exceção e.printStackTrace(); ou logger.error("Erro ao gerar token", e);
            throw new RuntimeException("Erro ao gerar token JWT", e);
        }
    }

    public DecodedJWT validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(emissor)
                    .build();
            return verifier.verify(token);
        } catch (Exception e) {
            // logger.warn("Token JWT inválido ou expirado: {}", e.getMessage());
            throw new RuntimeException("Token JWT inválido ou expirado", e);
        }
    }

    public Instant gerarDataExpiracao() {
        // Exemplo usa plusDays. Se expirationTime = 5, são 5 dias.
        return LocalDateTime.now()
                .plusDays(expirationTime) // Use plusHours, plusMinutes se preferir
                .toInstant(ZoneOffset.of("-03:00")); // Ajuste o ZoneOffset para o seu fuso horário se necessário (Brasília é -03:00)
    }
}