export class Titulo {
  constructor(
    private readonly _nome: string,
    private readonly _jogo: string,
  ) {
    if (_nome.trim().length === 0) {
      throw new Error("Todo título precisa de um nome.");
    }
  }

  get nome(): string {
    return this._nome;
  }

  get jogo(): string {
    return this._jogo;
  }

  descricao(): string {
    return `"${this._nome}" (${this._jogo})`;
  }
}
