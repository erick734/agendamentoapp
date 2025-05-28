package com.listagemUsuario.aulaBack.application.objetct.usuario;

public record UsuarioResponse(
        Long id,
        String usuario,
        String perfil,
        String nome,
        String sobrenome,
        String telefone,
        String cep,
        String localidade,
        String uf,
        String email
) { }