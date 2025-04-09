package com.listagemUsuario.aulaBack.controller;

import com.listagemUsuario.aulaBack.models.entities.Usuario;
import com.listagemUsuario.aulaBack.models.repository.UsuarioRepository;
import lombok.Getter;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Usuario usuario) {

        var retornoSalvarUsuario = usuarioRepository.save(usuario);

        return ResponseEntity.ok(retornoSalvarUsuario);
    }

    @GetMapping("/{id}")
    public Usuario ListarPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id).get();
    }

    @GetMapping
    public List<Usuario> list() {

        return usuarioRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Usuario usuario) {

        Optional<Usuario> editarUsuario = usuarioRepository.findById(id);

        if (editarUsuario.isPresent()) {

            Usuario retornoSalvarEdicaoUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(retornoSalvarEdicaoUsuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> deletar(@PathVariable Long id) {

        return ResponseEntity.ok(null);
    }


}