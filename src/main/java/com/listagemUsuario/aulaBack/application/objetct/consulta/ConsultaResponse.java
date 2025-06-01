package com.listagemUsuario.aulaBack.application.objetct.consulta;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaResponse {
    private Long id;
    private LocalDateTime dataHora;
    private String descricao;
    private String status;

    private Long idPaciente;
    private String nomePaciente;

    private Long idMedico;
    private String nomeMedico;
}