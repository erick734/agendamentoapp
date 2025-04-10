package com.listagemUsuario.aulaBack.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;

public class SwaggerConfiguration {

    @Bean
    public OpenAPI custonOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Aula FULLSTACK")
                .version("1.0")
                .description("Documentação de api da Aula de FULLSTACK"));
    }
}
