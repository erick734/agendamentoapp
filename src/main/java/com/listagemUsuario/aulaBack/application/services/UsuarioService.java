package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioResponse;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Email;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Telefone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioResponse usuarioLogado() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        var usuarioLogado = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Erro ao encontrar o usuário"));

        return toResponse(usuarioLogado);
    }

    public UsuarioResponse buscarPorId(Long id) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));
        return toResponse(usuario);
    }

    public Usuario salvar(UsuarioRequest entrada) {
        var usuario = new Usuario(entrada);
        usuario.setSenha(entrada.senha());
        return usuarioRepository.save(usuario);
    }

    public List<UsuarioResponse> listarTodos() {
        var usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse usuarioEditado(Long id, UsuarioRequest entrada) {
        var usuarioEncontrado = usuarioRepository.findById(id);

        if (usuarioEncontrado.isPresent()) {
            var usuario = usuarioEncontrado.get();
            usuario.setNome(entrada.nome());
            usuario.setSobrenome(entrada.sobrenome());
            usuario.setTelefone(new Telefone(entrada.telefone()));
            usuario.setCep(entrada.cep());
            usuario.setLocalidade(entrada.localidade());
            usuario.setUf(entrada.uf());

            if (entrada.email() != null && !entrada.email().isEmpty()) {
                usuario.setEmail(new Email(entrada.email()));
            }

            if (entrada.senha() != null && !entrada.senha().isEmpty()) {
                usuario.setSenha(entrada.senha());
            }

            usuarioRepository.save(usuario);
            return toResponse(usuario);
        }

        throw new RuntimeException("Erro: Usuário com ID " + id + " não encontrado para atualização.");
    }

    public Long deletar(Long id) {
        var usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            usuarioRepository.deleteById(id);
            return id;
        }

        throw new RuntimeException("Erro ao encontrar o usuário");
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getUsuario(),
                usuario.getNome(),
                usuario.getSobrenome(),
                usuario.getPerfil(),
                usuario.getTelefone() != null ? usuario.getTelefone().getTelefone() : null,
                usuario.getCep(),
                usuario.getLocalidade(),
                usuario.getUf(),
                usuario.getEmail() != null ? usuario.getEmail().getEmail() : null
        );
    }

    public List<UsuarioResponse> listarPorPerfil(String perfil) {
        var usuarios = usuarioRepository.findByPerfil(perfil);
        return usuarios.stream()
                .map(this::toResponse)
                .toList();
    }
}