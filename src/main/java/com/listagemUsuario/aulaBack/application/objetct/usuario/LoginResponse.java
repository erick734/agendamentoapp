package com.listagemUsuario.aulaBack.application.objetct.usuario;

public record LoginResponse(
        Long id,
        String nome,
        String perfil,
        String token
) { }