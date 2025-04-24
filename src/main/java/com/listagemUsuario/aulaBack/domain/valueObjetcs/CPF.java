package com.listagemUsuario.aulaBack.domain.valueObjetcs;

public class CPF {

    private String cpf;

    public CPF(String cpf) {
        if (cpf==null || !isValid(cpf)){
            throw new IllegalArgumentException("CPF invalido");
        }
        this.cpf = "";
    }

    public String getNumero() {
        return cpf;
    }

    public boolean isValid() {
        return !cpf.equals("");
    }

    private boolean isValid(String cpf) {
        String cpfNumeros = cpf.replaceAll("[^0-9]", "");
        if (cpfNumeros.length() != 11 || cpfNumeros.matches("(\\d)\\1{10}")) {
            return false;
        }
        return validarDigitosVerificadores(cpfNumeros);
    }

    private boolean validarDigitosVerificadores(String cpf) {
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += (cpf.charAt(i) - '0') * (10 - i);
        }
        int primeiroDigito = (soma * 10) % 11;
        if (primeiroDigito == 10) primeiroDigito = 0;
        if (primeiroDigito != (cpf.charAt(9) - '0')) {
            return false;
        }
        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += (cpf.charAt(i) - '0') * (11 - i);
        }
        int segundoDigito = (soma * 10) % 11;
        if (segundoDigito == 10) segundoDigito = 0;
        return segundoDigito == (cpf.charAt(10) - '0');
    }

    @Override
    public String toString() {
        return this.cpf;
    }
}
