package com.listagemUsuario.aulaBack.domain.entities;

import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.CPF;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Data
@Getter
@Setter
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private CPF cpf;

    private String usuario;
    private String senha;
    private String perfil;
    private String nome;
    private String sobrenome;
    private String telefone;
    private String cep;
    private String localidade;
    private String uf;
    private String email;

    public CPF getCPF() {
        return cpf;
    }

    public void setCPF(CPF cpf) {
        this.cpf = cpf;
    }

    public Usuario(){}

    public Usuario(UsuarioRequest entrada){
        this.email= entrada.email();
        this.senha=entrada.senha();
    }
}