package com.listagemUsuario.aulaBack.models.repository;

import com.listagemUsuario.aulaBack.models.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuarioAndSenha(String usuario, String senha);

    Optional<Usuario> findByPerfil (String perfil);

    Optional<Usuario> findByUsuarioIgnoreCase(String name);

    Optional<Usuario> findByEmail(String email);
}