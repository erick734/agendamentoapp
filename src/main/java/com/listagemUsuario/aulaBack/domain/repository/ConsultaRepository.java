package com.listagemUsuario.aulaBack.domain.repository;

import com.listagemUsuario.aulaBack.domain.entities.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findByIdPaciente(Long idPaciente);

    List<Consulta> findByIdMedico(Long idMedico);
}