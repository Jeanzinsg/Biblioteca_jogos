import type { Atributos, Combatente } from "../contratos.ts";

export abstract class Personagem implements Combatente {
  private _vida: number;

  constructor(
    private readonly _nome: string,
    private readonly _nivel: number,
    protected readonly atributos: Atributos,
    private readonly _arma: string,
  ) {
    if (_nome.trim() === "") {
      throw new Error("O personagem precisa de um nome.");
    }
    if (_nivel < 1) {
      throw new Error("O nível mínimo é 1.");
    }
    this._vida = this.vidaMaxima();
  }

  abstract classe(): string;

  abstract habilidade(): string;

  abstract atacar(alvo: Combatente): string;

  get nome(): string {
    return this._nome;
  }

  get nivel(): number {
    return this._nivel;
  }

  get vida(): number {
    return this._vida;
  }

  get arma(): string {
    return this._arma;
  }

  vidaMaxima(): number {
    return 100 + this._nivel * 5;
  }

  estaVivo(): boolean {
    return this._vida > 0;
  }

  receberDano(dano: number): void {
    if (dano < 0) {
      throw new Error("O dano não pode ser negativo.");
    }
    if (!this.estaVivo()) {
      throw new Error(`${this._nome} já foi derrotado.`);
    }
    this._vida = Math.max(0, this._vida - dano);
  }

  ficha(): string {
    return [
      `${this._nome}: ${this.classe()} nível ${this._nivel}`,
      `  Vida ${this.vidaMaxima()} | Ataque: ${this.habilidade()}`,
      `  Força ${this.atributos.forca} | Inteligência ${this.atributos.inteligencia} | Agilidade ${this.atributos.agilidade}`,
      `  Arma lendária: ${this._arma}`,
    ].join("\n");
  }
}
