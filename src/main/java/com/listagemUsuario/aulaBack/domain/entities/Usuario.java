package com.listagemUsuario.aulaBack.domain.entities;

import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Email;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Telefone;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
public class Usuario implements UserDetails {

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
        this.usuario = entrada.email();
        this.email = new Email(entrada.email());
        this.senha = entrada.senha();
        this.perfil = entrada.perfil();
        this.nome = entrada.nome();
        this.sobrenome = entrada.sobrenome();
        this.telefone = new Telefone(entrada.telefone());
        this.cep = entrada.cep();
        this.localidade = entrada.localidade();
        this.uf = entrada.uf();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.perfil.toUpperCase()));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email != null ? this.email.getEmail() : null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}