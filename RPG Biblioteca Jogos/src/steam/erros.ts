export class ErroSteam extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroSteam";
  }
}

export class ChaveInvalidaError extends ErroSteam {
  constructor() {
    super("A Steam recusou a chave da API. Confira o STEAM_API_KEY no arquivo .env.");
    this.name = "ChaveInvalidaError";
  }
}

export class PerfilNaoEncontradoError extends ErroSteam {
  constructor(entrada: string) {
    super(`Nenhum perfil encontrado para "${entrada}".`);
    this.name = "PerfilNaoEncontradoError";
  }
}

export class PerfilPrivadoError extends ErroSteam {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "PerfilPrivadoError";
  }
}
