package com.listagemUsuario.aulaBack.application.objetct.usuario;

public record UsuarioRequest(
        String email,
        String senha,
        String perfil,
        String nome,
        String sobrenome,
        String telefone,
        String cep,
        String localidade,
        String uf,
        Long idEmpresa
) { }