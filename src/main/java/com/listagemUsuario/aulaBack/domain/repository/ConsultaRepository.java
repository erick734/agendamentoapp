package com.listagemUsuario.aulaBack.domain.repository;

import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
}
