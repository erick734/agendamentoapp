package com.listagemUsuario.aulaBack.application.objetct.usuario;

public record UsuarioRequest(
        String nome,
        String sobrenome,
        String telefone,
        String cep,
        String localidade,
        String uf,
        String email,
        String senha,
        String perfil
) { }