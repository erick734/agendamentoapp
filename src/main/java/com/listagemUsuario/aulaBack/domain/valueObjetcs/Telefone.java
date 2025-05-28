package com.listagemUsuario.aulaBack.domain.valueObjetcs;

import jakarta.persistence.Embeddable;

@Embeddable
public class Telefone {

    private String telefone;

    public Telefone() {}

    public Telefone(String telefone) {
        if (!isValid(telefone)) {
            throw new IllegalArgumentException("Telefone inválido.");
        }
        this.telefone = telefone;
    }

    public String getTelefone() {
        return telefone;
    }

    private boolean isValid(String telefone) {
        return telefone != null && telefone.matches("\\d{10,11}");
        // Aceita DDD + número (ex: 11999999999 ou 1122223333)
    }

    @Override
    public String toString() {
        return telefone;
    }
}
