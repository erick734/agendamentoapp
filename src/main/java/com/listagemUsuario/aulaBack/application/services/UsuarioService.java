package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.alterarDados.AlterarEmailRequest;
import com.listagemUsuario.aulaBack.application.objetct.alterarDados.AlterarSenhaRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioRequest;
import com.listagemUsuario.aulaBack.application.objetct.usuario.UsuarioResponse;
import com.listagemUsuario.aulaBack.domain.entities.Usuario;
import com.listagemUsuario.aulaBack.domain.repository.UsuarioRepository;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Email;
import com.listagemUsuario.aulaBack.domain.valueObjetcs.Telefone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioResponse usuarioLogado() {
        return toResponse(getUsuarioLogado());
    }

    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuarioLogado = getUsuarioLogado();
        if (!usuarioLogado.getId().equals(id) && !usuarioLogado.getPerfil().equalsIgnoreCase("A")) {
            throw new AccessDeniedException("Você não tem permissão para ver este perfil.");
        }
        return usuarioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));
    }

    public Usuario salvar(UsuarioRequest entrada) {
        if (usuarioRepository.findByEmail(entrada.email()).isPresent()) {
            throw new RuntimeException("Este e-mail já está em uso.");
        }
        var usuario = new Usuario(entrada);
        usuario.setSenha(entrada.senha());
        return usuarioRepository.save(usuario);
    }

    public List<UsuarioResponse> listarTodos() {
        Usuario usuarioLogado = getUsuarioLogado();
        if (!usuarioLogado.getPerfil().equalsIgnoreCase("A")) {
            throw new AccessDeniedException("Você não tem permissão para listar todos os usuários.");
        }
        return usuarioRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponse usuarioEditado(Long id, UsuarioRequest entrada) {
        Usuario usuarioLogado = getUsuarioLogado();
        if (!usuarioLogado.getId().equals(id) && !usuarioLogado.getPerfil().equalsIgnoreCase("A")) {
            throw new AccessDeniedException("Você não tem permissão para editar este perfil.");
        }

        Usuario usuarioParaEditar = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Erro: Usuário com ID " + id + " não encontrado."));

        usuarioParaEditar.setNome(entrada.nome());
        usuarioParaEditar.setSobrenome(entrada.sobrenome());
        usuarioParaEditar.setTelefone(new Telefone(entrada.telefone()));
        usuarioParaEditar.setCep(entrada.cep());
        usuarioParaEditar.setLocalidade(entrada.localidade());
        usuarioParaEditar.setUf(entrada.uf());

        usuarioRepository.save(usuarioParaEditar);
        return toResponse(usuarioParaEditar);
    }

    public void deletar(Long id) {
        Usuario usuarioLogado = getUsuarioLogado();
        if (!usuarioLogado.getId().equals(id) && !usuarioLogado.getPerfil().equalsIgnoreCase("A")) {
            throw new AccessDeniedException("Você não tem permissão para deletar este perfil.");
        }
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Erro ao deletar: Usuário com ID " + id + " não encontrado.");
        }
        usuarioRepository.deleteById(id);
    }

    public List<UsuarioResponse> listarPorPerfil(String perfil) {
        return usuarioRepository.findByPerfil(perfil).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void alterarEmail(String emailUsuarioLogado, AlterarEmailRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));
        if (!usuario.getSenha().equals(request.senhaAtual())) {
            throw new BadCredentialsException("Senha atual incorreta.");
        }
        if (usuarioRepository.findByEmail(request.novoEmail()).isPresent()) {
            throw new IllegalStateException("O novo e-mail já está em uso.");
        }
        usuario.setEmail(new Email(request.novoEmail()));
        usuario.setUsuario(request.novoEmail());
        usuarioRepository.save(usuario);
    }

    public void alterarSenha(String emailUsuarioLogado, AlterarSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));
        if (!usuario.getSenha().equals(request.senhaAtual())) {
            throw new BadCredentialsException("Senha atual incorreta.");
        }
        usuario.setSenha(request.novaSenha());
        usuarioRepository.save(usuario);
    }

    // --- MÉTODOS PRIVADOS ---
    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException("Usuário não autenticado.");
        }
        return usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário da autenticação não encontrado."));
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
}