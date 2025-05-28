package com.listagemUsuario.aulaBack.presentation.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod; // Não necessário se permitir tudo em /usuario
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.config.Customizer; // Se usar .cors(Customizer.withDefaults())
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// Importe PasswordEncoder se o bean estiver aqui, mas não vamos usá-lo nos services para seguir o exemplo
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private JwtFilter jwtFilter;

    // O bean PasswordEncoder é uma boa prática, mas não será usado nos services
    // se estamos estritamente seguindo o exemplo de senha em texto plano.
    // @Bean
    // public PasswordEncoder passwordEncoder() {
    //    return new BCryptPasswordEncoder();
    // }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                // Para CORS, sua configuração CorsConfig já existe e é global via WebMvcConfigurer.
                // Se precisar de .cors(Customizer.withDefaults()) aqui, certifique-se que é a intenção.
                .authorizeHttpRequests(auth -> auth
                        // SIGA O EXEMPLO: Permite todas estas rotas sem autenticação
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/webjars/**",
                                "/swagger-resources/**",
                                "/auth/**",       // Todas as sub-rotas de /auth
                                "/usuario/**"     // TODAS AS SUB-ROTAS E MÉTODOS DE /usuario
                        ).permitAll()
                        .anyRequest().authenticated() // Qualquer outra rota requer autenticação
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}