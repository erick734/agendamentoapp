package com.listagemUsuario.aulaBack.controller;

import com.listagemUsuario.aulaBack.configuration.SecurityConfiguration;
import com.listagemUsuario.aulaBack.models.entities.Usuario;
import com.listagemUsuario.aulaBack.models.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Usuarios", description = "Endereço responsavel pelo controle de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;


    @PostMapping("/cadastrar")
    @Operation(summary = "Cadastrar usuario", description = "")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario){
        var retornoSalvarUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(retornoSalvarUsuario);
    }


    @PostMapping
    @Operation(summary = "Salvar o usuario", description = "Metodo responsavel por salvar o usuario")
    public ResponseEntity<?> salvar(@RequestBody Usuario usuario) {

        var retornoSalvarUsuario = usuarioRepository.save(usuario);

        return ResponseEntity.ok(retornoSalvarUsuario);
    }

    @GetMapping("/{id}")
    public Usuario ListarPorId(@PathVariable Long id) {
var usuario = UsuarioLogado();
        return usuarioRepository.findById(id).get();
    }

    public String UsuarioLogado(){
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @GetMapping
    public List<Usuario> list() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        auth.getName();

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