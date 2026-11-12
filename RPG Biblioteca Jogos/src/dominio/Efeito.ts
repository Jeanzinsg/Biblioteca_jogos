import type { Atributos } from "../contratos.ts";

export abstract class Efeito {
  constructor(private readonly _nome: string) {
    if (_nome.trim().length === 0) {
      throw new Error("Todo efeito precisa de um nome.");
    }
  }

  get nome(): string {
    return this._nome;
  }

  abstract descricao(): string;

  abstract aplicar(atributos: Atributos): Atributos;
}
