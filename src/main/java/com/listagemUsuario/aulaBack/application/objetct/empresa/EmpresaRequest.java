package com.listagemUsuario.aulaBack.application.objetct.empresa;

public record EmpresaRequest(
        String nome,
        String cnpj,
        String cep,
        String uf,
        String localidade
) {}