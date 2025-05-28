package com.listagemUsuario.aulaBack.domain.valueObjetcs;

import jakarta.persistence.Embeddable;

import java.util.regex.Pattern;

@Embeddable
public class Email {

    private static final String EMAIL_REGEX = "^[\\w-\\.]+@[\\w-]+\\.[a-z]{2,}$";
    private static final Pattern PATTERN = Pattern.compile(EMAIL_REGEX, Pattern.CASE_INSENSITIVE);

    private String email;

    public Email() {}

    public Email(String email) {
        if (!isValid(email)) {
            throw new IllegalArgumentException("Email inválido.");
        }
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    private boolean isValid(String email) {
        return email != null && PATTERN.matcher(email).matches();
    }

    @Override
    public String toString() {
        return email;
    }
}
