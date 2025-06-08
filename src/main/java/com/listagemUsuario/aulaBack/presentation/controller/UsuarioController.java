package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.application.services.UsuarioService;
import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Usuário", description = "Endereço responsável pelo controle de requisições do usuário")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/{id}")
    @Operation(summary = "Obter usuário por ID", description = "Retorna os dados de um usuário específico pelo seu ID")
    public ResponseEntity<?> getUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioResponse usuario = usuarioService.buscarPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar usuário: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "Salvar usuário", description = "Método responsável por salvar um novo usuário")
    public ResponseEntity<?> salvar(@RequestBody UsuarioRequest usuarioRequest) {
        try {
            var usuarioSalvo = usuarioService.salvar(usuarioRequest);
            return ResponseEntity.ok().body(usuarioSalvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar o usuário: " + e.getMessage());
        }
    }

    @GetMapping("/listarUm")
    @Operation(summary = "Obter usuário logado", description = "Retorna o usuário atualmente autenticado")
    public ResponseEntity<?> listarUm() {
        try {
            UsuarioResponse usuario = usuarioService.usuarioLogado();
            return ResponseEntity.ok().body(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar usuário logado: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    @Operation(summary = "Listar todos os usuários", description = "Retorna a lista de todos os usuários")
    public ResponseEntity<?> listarTodos() {
        try {
            var usuarios = usuarioService.listarTodos();
            return ResponseEntity.ok().body(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar usuários: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar usuário", description = "Atualiza dados do usuário pelo ID")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody UsuarioRequest usuarioAtualizado) {
        try {
            var usuarioEditado = usuarioService.usuarioEditado(id, usuarioAtualizado);
            return ResponseEntity.ok().body(usuarioEditado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    @DeleteMapping("/deletar/{id}")
    @Operation(summary = "Deletar usuário", description = "Deleta usuário pelo ID")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            usuarioService.deletar(id);
            return ResponseEntity.ok().body("Exclusão realizada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar usuário: " + e.getMessage());
        }
    }

    @GetMapping("/perfil/{perfil}")
    @Operation(summary = "Listar usuários por perfil", description = "Retorna a lista de usuários com um perfil específico (ex: 'm' para médico)")
    public ResponseEntity<?> getUsuariosPorPerfil(@PathVariable String perfil) {
        try {
            var usuarios = usuarioService.listarPorPerfil(perfil);
            return ResponseEntity.ok().body(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar usuários por perfil: " + e.getMessage());
        }
    }
}
