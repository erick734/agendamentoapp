package com.listagemUsuario.aulaBack.services;

import com.listagemUsuario.aulaBack.models.entities.Usuario;
import com.listagemUsuario.aulaBack.models.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.listagemUsuario.aulaBack.models.entities.Usuario;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario UsuarioLogado(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return usuarioRepository
                .findByEmail( auth.getName()).orElse(null);
    }
}
