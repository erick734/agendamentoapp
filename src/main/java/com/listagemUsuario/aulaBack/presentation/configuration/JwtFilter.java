package com.listagemUsuario.aulaBack.presentation.configuration;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.listagemUsuario.aulaBack.application.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService; // Seu TokenService baseado no exemplo

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // SIGA O EXEMPLO: Isenções de caminho do exemplo
        // O exemplo isenta "/auth" (para POST login), "/usuario" (todos os métodos), e Swagger.
        // "/logout" também é isento no exemplo, mas você não tem essa rota definida.
        if (path.equals("/auth") // Assumindo que é para o POST do login
                || request.getMethod().equals("POST") && path.equals("/auth") // Mais específico para POST
                || path.startsWith("/usuario") // ISENTA TODAS AS ROTAS /usuario DE VERIFICAÇÃO DE TOKEN AQUI
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.replace("Bearer ", "");
            try {
                DecodedJWT jwt = tokenService.validarToken(token);
                // O subject agora é o 'usuario' (username), não o email.
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                jwt.getSubject(), // Deve ser o 'usuario' (username)
                                null,
                                Collections.emptyList()
                        );
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token invalido"); // Mensagem do exemplo
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}