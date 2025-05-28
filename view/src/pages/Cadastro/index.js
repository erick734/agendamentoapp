import React, { useState } from "react";
import BuscaEndereco from "../BuscaEndereco";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../../service/usuarioService";

export default function Cadastro() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("p");
  const [endereco, setEndereco] = useState({
    cep: "",
    localidade: "",
    uf: "",
  });
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

const validarTelefone = (numero) => {
  const numeroLimpo = numero.replace(/\D/g, "");

  if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
    setErroTelefone("Número inválido. Inclua o DDD.");
  } else if (numeroLimpo.length === 11 && numeroLimpo[2] !== "9") {
    setErroTelefone("Celular deve ter o nono dígito (ex: 9XXXX...).");
  } else {
    setErroTelefone("");
  }

  setTelefone(numero);
};

  async function cadastrarUsuario(e) {
    e.preventDefault();
    if (erroTelefone) {
      alert("Por favor, corrija o erro no telefone.");
      return;
    }
    setCarregando(true);

    const payload = {
      usuario: usuario, // Se o backend espera 'email' como login, considere usar um campo de email
      email: usuario,   // Ou tenha um campo de email separado no formulário
      senha: senha,
      perfil: perfil,
      nome: nome,
      sobrenome: sobrenome,
      telefone: telefone.replace(/\D/g, ""), // Enviar apenas números para o backend é uma boa prática
      // Endereço: Verifique se o backend espera um objeto aninhado ou campos separados
      // Opção 1: Objeto aninhado (se o backend esperar algo como { ..., endereco: { cep: ..., ... } })
      // endereco: {
      //   cep: endereco.cep || "",
      //   localidade: endereco.localidade || "",
      //   uf: endereco.uf || "",
      //   logradouro: endereco.logradouro || "", // Exemplo
      //   bairro: endereco.bairro || ""         // Exemplo
      // },
      // Opção 2: Campos separados (como no seu código original)
      cep: endereco.cep || "",
      localidade: endereco.localidade || "",
      uf: endereco.uf || "",
    };

    try {
      // Usando o serviço de usuário
      await usuarioService.cadastrar(payload);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(
        "Erro ao cadastrar usuário:",
        error.response ? error.response.data : error.message
      );
      const mensagemErro = error.response?.data?.message || error.response?.data?.error || "Erro ao cadastrar o usuário. Verifique os dados ou tente novamente.";
      alert(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center fw-bold">Cadastro de Usuário</h2>
        <p className="text-muted text-center">Preencha as informações abaixo.</p>

        <form onSubmit={cadastrarUsuario} className="mt-3">
          {/* Usuário (Login/Email) */}
          <div className="mb-3">
            <label className="form-label fw-bold">Usuário (será seu login/email)</label>
            <input
              type="email" // Recomenda-se usar type="email" para validação básica
              className="form-control form-control-lg"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

          {/* Senha */}
          <div className="mb-3">
            <label className="form-label fw-bold">Senha</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6} // Exemplo de validação
              disabled={carregando}
            />
          </div>

          {/* Nome */}
          <div className="mb-3">
            <label className="form-label fw-bold">Nome</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

          {/* Sobrenome */}
          <div className="mb-3">
            <label className="form-label fw-bold">Sobrenome</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

          {/* Telefone */}
          <div className="mb-3">
            <label className="form-label fw-bold">Telefone</label>
            <input
              type="tel"
              className={`form-control form-control-lg ${erroTelefone ? "is-invalid" : ""}`}
              placeholder="Ex: (XX) 9XXXX-XXXX"
              value={telefone}
              onChange={(e) => validarTelefone(e.target.value)}
              required
              disabled={carregando}
            />
            {erroTelefone && <div className="invalid-feedback">{erroTelefone}</div>}
          </div>

          {/* Perfil */}
          <div className="mb-3">
            <label className="form-label fw-bold">Perfil</label>
            <select
              className="form-control form-control-lg"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              required
              disabled={carregando}
            >
              <option value="p">Paciente</option>
              <option value="m">Médico</option>
              <option value="a">Administrador</option>
            </select>
          </div>

          <BuscaEndereco setEndereco={setEndereco} disabled={carregando} />

          <div className="mb-3">
            <label className="form-label fw-bold">CEP</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={endereco.cep || ""}
              onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
              disabled // Geralmente desabilitado se vem do BuscaEndereco
            />
          </div>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label className="form-label fw-bold">Localidade</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={endereco.localidade || ""}
                onChange={(e) => setEndereco({ ...endereco, localidade: e.target.value })}
                disabled // Geralmente desabilitado
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">UF</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={endereco.uf || ""}
                onChange={(e) => setEndereco({ ...endereco, uf: e.target.value })}
                disabled // Geralmente desabilitado
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 mt-3" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-lg w-100 mt-2"
            onClick={() => navigate("/login")}
            disabled={carregando}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}