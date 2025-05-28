package com.listagemUsuario.aulaBack.domain.entities;

import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Email;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Telefone;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuario;
    private String senha;
    private String perfil;
    private String nome;
    private String sobrenome;

    @Embedded
    private Telefone telefone;

    private String cep;
    private String localidade;
    private String uf;

    @Embedded
    private Email email;

    public Usuario(UsuarioRequest entrada) {
        this.usuario = entrada.usuario();
        this.senha = entrada.senha();
        this.perfil = entrada.perfil();
        this.nome = entrada.nome();
        this.sobrenome = entrada.sobrenome();
        this.telefone = new Telefone(entrada.telefone());
        this.cep = entrada.cep();
        this.localidade = entrada.localidade();
        this.uf = entrada.uf();
        this.email = new Email(entrada.email());
    }
}
