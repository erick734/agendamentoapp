package com.listagemUsuario.aulaBack.presentation.controller;

import com.listagemUsuario.aulaBack.application.objetct.alterarDados.AlterarEmailRequest;
import com.listagemUsuario.aulaBack.application.objetct.alterarDados.AlterarSenhaRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.application.services.UsuarioService;
import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Usuário", description = "Endpoints para gerenciamento de usuários")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @Operation(summary = "Criar um novo usuário", description = "Cria um novo Paciente ou Médico.")
    public ResponseEntity<?> salvar(@RequestBody UsuarioRequest usuarioRequest) {
        try {
            var usuarioSalvo = usuarioService.salvar(usuarioRequest);
            return ResponseEntity.status(201).body(usuarioSalvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário logado", description = "Retorna os dados do usuário autenticado.")
    public ResponseEntity<?> getUsuarioLogado() {
        try {
            UsuarioResponse usuario = usuarioService.usuarioLogado();
            return ResponseEntity.ok().body(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar-todos")
    @Operation(summary = "Listar todos os usuários (Admin)", description = "Retorna a lista de todos os usuários. Apenas para Admins.")
    public ResponseEntity<?> listarTodos() {
        try {
            var usuarios = usuarioService.listarTodos();
            return ResponseEntity.ok().body(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/perfil/{perfil}")
    @Operation(summary = "Listar usuários por perfil", description = "Retorna a lista de usuários com um perfil específico.")
    public ResponseEntity<?> getUsuariosPorPerfil(@PathVariable String perfil) {
        try {
            var usuarios = usuarioService.listarPorPerfil(perfil);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/medicos/empresa/{empresaId}")
    @Operation(summary = "Listar médicos por empresa", description = "Retorna a lista de médicos de uma empresa específica.")
    public ResponseEntity<List<UsuarioResponse>> getMedicosPorEmpresa(@PathVariable Long empresaId) {
        var medicos = usuarioService.listarPorPerfilEIDEmpresa("m", empresaId);
        return ResponseEntity.ok(medicos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter usuário por ID", description = "Retorna os dados de um usuário específico.")
    public ResponseEntity<?> getUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioResponse usuario = usuarioService.buscarPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar usuário", description = "Atualiza os dados de um usuário pelo seu ID.")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody UsuarioRequest usuarioAtualizado) {
        try {
            var usuarioEditado = usuarioService.usuarioEditado(id, usuarioAtualizado);
            return ResponseEntity.ok().body(usuarioEditado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/alterar-email")
    @Operation(summary = "Alterar e-mail", description = "Permite que o usuário logado altere seu e-mail.")
    public ResponseEntity<String> alterarEmail(Authentication authentication, @RequestBody AlterarEmailRequest request) {
        try {
            usuarioService.alterarEmail(authentication.getName(), request);
            return ResponseEntity.ok("E-mail alterado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/alterar-senha")
    @Operation(summary = "Alterar senha", description = "Permite que o usuário logado altere sua senha.")
    public ResponseEntity<String> alterarSenha(Authentication authentication, @RequestBody AlterarSenhaRequest request) {
        try {
            usuarioService.alterarSenha(authentication.getName(), request);
            return ResponseEntity.ok("Senha alterada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar usuário", description = "Deleta um usuário pelo seu ID.")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}