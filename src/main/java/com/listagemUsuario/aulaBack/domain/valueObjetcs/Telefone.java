package com.listagemUsuario.aulaBack.domain.valueObjetcs;

import jakarta.persistence.Embeddable;

@Embeddable
public class Telefone {

    private String telefone;

    public Telefone() {}

    public Telefone(String telefone) {
        String somenteNumeros = telefone != null ? telefone.replaceAll("\\D", "") : null;

        if (!isValid(somenteNumeros)) {
            throw new IllegalArgumentException("Telefone inválido.");
        }
        this.telefone = somenteNumeros;
    }

    public String getTelefone() {
        return telefone;
    }

    private boolean isValid(String telefone) {
        return telefone != null && telefone.matches("\\d{10,11}");
    }

    @Override
    public String toString() {
        return telefone;
    }
}
