import type { Combatente } from "../contratos.ts";

export class ChefeDoBacklog implements Combatente {
  static readonly VIDA_POR_JOGO = 60;

  private _vida: number;
  private _rodada = 0;

  constructor(
    private readonly _dono: string,
    private readonly _jogosParados: string[],
  ) {
    if (_jogosParados.length === 0) {
      throw new Error(`${_dono} jogou tudo o que comprou. Nenhum jogo pegando pó, nenhum chefe!`);
    }
    this._vida = 100 + _jogosParados.length * ChefeDoBacklog.VIDA_POR_JOGO;
  }

  get nome(): string {
    return `Acumulador de Poeira de ${this._dono}`;
  }

  get vida(): number {
    return this._vida;
  }

  get tamanho(): number {
    return this._jogosParados.length;
  }

  estaVivo(): boolean {
    return this._vida > 0;
  }

  receberDano(dano: number): void {
    if (dano < 0) {
      throw new Error("O dano não pode ser negativo.");
    }
    if (!this.estaVivo()) {
      throw new Error("Essa poeira já foi limpa.");
    }
    this._vida = Math.max(0, this._vida - dano);
  }

  atacar(alvo: Combatente): string {
    const jogo = this._jogosParados[this._rodada % this._jogosParados.length];
    const dano = 10 + this._jogosParados.length + this._rodada * 3;
    this._rodada++;
    alvo.receberDano(dano);
    return `O ${this.nome} arremessou "${jogo}" (0h jogadas) em ${alvo.nome}: ${dano} de dano`;
  }
}
