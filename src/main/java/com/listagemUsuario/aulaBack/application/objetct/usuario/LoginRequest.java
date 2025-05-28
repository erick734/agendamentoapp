package com.listagemUsuario.aulaBack.application.objetct.usuario;

public record LoginRequest(
        String usuario,
        String senha
) { }