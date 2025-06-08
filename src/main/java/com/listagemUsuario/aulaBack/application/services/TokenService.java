package com.listagemUsuario.aulaBack.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    @Value("${spring.expiration_time}")
    private Long expirationTime;

    @Value("${spring.secretkey}")
    private String secret;

    @Value("${spring.emissor}")
    private String emissor;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer(emissor)
                    .withSubject(usuario.getEmail().getEmail())
                    .withClaim("perfil", usuario.getPerfil())
                    .withExpiresAt(this.gerarDataExpiracao())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public DecodedJWT validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(emissor)
                    .build();
            return verifier.verify(token);
        } catch (JWTVerificationException exception) {
            logger.warn("Tentativa de validação de token JWT falhou: {}", exception.getMessage());
            return null;
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now()
                .plusDays(expirationTime)
                .toInstant(ZoneOffset.of("-03:00"));
    }
}