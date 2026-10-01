export class ErroColecao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = new.target.name; // mantém o nome da subclasse
  }
}

export class JogoNaoEncontradoError extends ErroColecao {
  constructor(identificador: string) {
    super(`Jogo não encontrado: ${identificador}`);
  }
}

export class DadosInvalidosError extends ErroColecao {
  constructor(mensagem: string) {
    super(`Dados inválidos: ${mensagem}`);
  }
}

export class PersistenciaError extends ErroColecao {
  constructor(mensagem: string) {
    super(`Erro de persistência: ${mensagem}`);
  }
}
