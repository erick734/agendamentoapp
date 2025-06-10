package com.listagemUsuario.aulaBack.application.objetct.consulta;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ConsultaRequest {
    private LocalDateTime dataHora;
    private String descricao;
    private Long idPaciente;
    private Long idMedico;
}
