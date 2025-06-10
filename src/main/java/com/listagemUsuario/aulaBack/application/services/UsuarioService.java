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
import org.springframework.security.authentication.BadCredentialsException;
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
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var usuarioLogado = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Erro ao encontrar o usuário logado."));
        return toResponse(usuarioLogado);
    }

    public UsuarioResponse buscarPorId(Long id) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o ID: " + id));
        return toResponse(usuario);
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
        var usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponse usuarioEditado(Long id, UsuarioRequest entrada) {
        var usuarioEncontrado = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Erro: Usuário com ID " + id + " não encontrado para atualização."));

        var usuario = usuarioEncontrado;
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

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Erro ao deletar: Usuário com ID " + id + " não encontrado.");
        }
        usuarioRepository.deleteById(id);
    }

    public List<UsuarioResponse> listarPorPerfil(String perfil) {
        var usuarios = usuarioRepository.findByPerfil(perfil);
        return usuarios.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
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

}