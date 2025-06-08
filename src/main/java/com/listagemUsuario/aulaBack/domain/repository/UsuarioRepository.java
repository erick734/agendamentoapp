package com.listagemUsuario.aulaBack.domain.repository;

import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u WHERE u.email.email = :email AND u.senha = :senha")
    Optional<Usuario> findByEmailAndSenha(@Param("email") String email, @Param("senha") String senha);

    @Query("SELECT u FROM Usuario u WHERE u.email.email = :email")
    Optional<Usuario> findByEmail(@Param("email") String email);

    List<Usuario> findByPerfil(String perfil);
}