package com.listagemUsuario.aulaBack.application.objetct;

public record AuthResponse(
        Long id,
        String usuario,
        String token
) {}