package com.listagemUsuario.aulaBack.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "usuario")
@Data
@Getter
@Setter
public class Usuario
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuario;
    private String senha;
    private String perfil;
    private String endereco;
    private String cep;
    private String localidade;
    private String uf;
}