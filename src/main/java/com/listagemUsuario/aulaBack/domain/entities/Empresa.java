package com.listagemUsuario.aulaBack.domain.entities;

import com.listagemUsuario.aulaBack.application.objetct.empresa.EmpresaRequest; // ✨ Importe o DTO
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "empresa")
@Getter
@Setter
@NoArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(unique = true)
    private String cnpj;
    private String cep;
    private String uf;
    private String localidade;

    public Empresa(EmpresaRequest request) {
        this.nome = request.nome();
        this.cnpj = request.cnpj();
        this.cep = request.cep();
        this.uf = request.uf();
        this.localidade = request.localidade();
    }
}