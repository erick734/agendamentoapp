package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.empresa.EmpresaRequest;
import com.listagemUsuario.aulaBack.domain.entities.Empresa;
import com.listagemUsuario.aulaBack.domain.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa criarEmpresa(EmpresaRequest request) {
        if (empresaRepository.findByCnpj(request.cnpj()).isPresent()) {
            throw new IllegalArgumentException("Uma empresa com este CNPJ já foi cadastrada.");
        }

        Empresa novaEmpresa = new Empresa();
        novaEmpresa.setNome(request.nome());
        novaEmpresa.setCnpj(request.cnpj());
        novaEmpresa.setCep(request.cep());
        novaEmpresa.setUf(request.uf());
        novaEmpresa.setLocalidade(request.localidade());

        return empresaRepository.save(novaEmpresa);
    }
}