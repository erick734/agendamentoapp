import React, { useState, useEffect } from "react";
import axios from "axios";
import { InputGroup, Form, Button, Spinner } from "react-bootstrap";

export default function BuscaEndereco({ setEndereco, endereco, disabled }) {
  const [cep, setCep] = useState(endereco?.cep || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (endereco?.cep === "") {
      setCep("");
    }
  }, [endereco?.cep]);

  const handleCepChange = (e) => {
    const valor = e.target.value.replace(/\D/g, "");
    const mascarado = valor
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
    
    setCep(mascarado);
  };

  const buscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setError("CEP inválido. Digite 8 números.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (response.data.erro) {
        setError("CEP não encontrado.");
        setEndereco({ cep, localidade: "", uf: "" });
        return;
      }
      const { localidade, uf } = response.data;
      setEndereco({ cep, localidade, uf });
    } catch (err) {
      setError("Erro ao buscar o CEP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <Form.Label className="fw-bold">Busca por CEP</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Digite o CEP"
          value={cep}
          onChange={handleCepChange}
          disabled={disabled || isLoading}
          isInvalid={!!error}
          maxLength={9}
        />
        <Button 
          variant="outline-secondary" 
          onClick={buscarEndereco} 
          disabled={disabled || isLoading}
        >
          {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Buscar"}
        </Button>
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      </InputGroup>
    </div>
  );
}