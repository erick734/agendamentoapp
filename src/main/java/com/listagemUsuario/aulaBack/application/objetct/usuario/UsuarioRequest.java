package com.listagemUsuario.aulaBack.application.objetct.usuario;

public record UsuarioRequest(
        Long id,
        String nome,
        String sobrenome,
        String usuario,
        String email,
        String telefone,
        String cep,
        String localidade,
        String uf,
        String perfil,
        String senha
) {}