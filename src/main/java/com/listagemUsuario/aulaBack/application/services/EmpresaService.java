package com.listagemUsuario.aulaBack.application.services;

import com.listagemUsuario.aulaBack.application.objetct.empresa.EmpresaRequest;
import com.listagemUsuario.aulaBack.domain.entities.Empresa;
import com.listagemUsuario.aulaBack.domain.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    public Empresa criarEmpresa(EmpresaRequest request) {
        if (empresaRepository.findByCnpj(request.cnpj()).isPresent()) {
            throw new IllegalArgumentException("Uma empresa com este CNPJ já foi cadastrada.");
        }

        Empresa novaEmpresa = new Empresa(request);

        return empresaRepository.save(novaEmpresa);
    }

    public List<Empresa> listarEmpresas() {
        return empresaRepository.findAll();
    }
}