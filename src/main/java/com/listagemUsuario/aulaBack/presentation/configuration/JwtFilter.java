package com.listagemUsuario.aulaBack.presentation.configuration;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.listagemUsuario.aulaBack.application.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");
            DecodedJWT jwt = tokenService.validarToken(token);

            if (jwt != null) {
                // ✨ LENDO O PERFIL DO TOKEN
                String perfil = jwt.getClaim("perfil").asString();

                // ✨ CRIANDO A PERMISSÃO QUE O SPRING SECURITY ENTENDE (Ex: "ROLE_A")
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + perfil.toUpperCase()));

                // Criando a autenticação com as permissões corretas
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        jwt.getSubject(),
                        null,
                        authorities // ✨ PASSANDO AS PERMISSÃO REAL
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }
}