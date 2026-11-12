import type { ResultadoAtaque, ResultadoBatalha, Sorteio } from "../contratos.ts";
import type { Personagem } from "../dominio/Personagem.ts";

export class Batalha {
  static readonly LIMITE_DE_ATAQUES = 200;

  constructor(
    private readonly _desafiante: Personagem,
    private readonly _desafiado: Personagem,
    private readonly _sorteio: Sorteio = Math.random,
  ) {
    if (_desafiante === _desafiado) {
      throw new Error("Um personagem não pode batalhar contra ele mesmo.");
    }
  }

  quemComeca(): Personagem {
    if (this._desafiado.atributos.agilidade > this._desafiante.atributos.agilidade) {
      return this._desafiado;
    }
    return this._desafiante;
  }

  lutar(): ResultadoBatalha {
    this._desafiante.restaurarVida();
    this._desafiado.restaurarVida();

    let atacante = this.quemComeca();
    let defensor = atacante === this._desafiante ? this._desafiado : this._desafiante;
    const ataques: ResultadoAtaque[] = [];

    while (atacante.estaVivo() && defensor.estaVivo() && ataques.length < Batalha.LIMITE_DE_ATAQUES) {
      ataques.push(atacante.atacar(defensor, this._sorteio));
      [atacante, defensor] = [defensor, atacante];
    }

    return { vencedor: this.vencedor(), ataques };
  }

  private vencedor(): string | undefined {
    if (this._desafiante.estaVivo() && !this._desafiado.estaVivo()) {
      return this._desafiante.nome;
    }
    if (this._desafiado.estaVivo() && !this._desafiante.estaVivo()) {
      return this._desafiado.nome;
    }
    return undefined;
  }
}
