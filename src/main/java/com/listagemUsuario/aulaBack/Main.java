package com.listagemUsuario.aulaBack;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.ArrayList;
import java.util.Scanner;

@SpringBootApplication
@EnableJpaRepositories
public class Main   {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}
}