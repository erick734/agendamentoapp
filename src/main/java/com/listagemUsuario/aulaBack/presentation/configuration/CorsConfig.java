package com.listagemUsuario.aulaBack.presentation.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Applies to all paths
                .allowedOrigins("*") // Allows all origins (for development, be more specific in production)
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS"); // Allows specified methods
    }
}