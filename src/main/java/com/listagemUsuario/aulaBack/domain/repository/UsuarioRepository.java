package com.listagemUsuario.aulaBack.domain.repository;

import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuarioAndSenha(String usuario, String senha);

    Optional<Usuario> findByUsuarioIgnoreCase(String name);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByPerfil(String perfil);
}