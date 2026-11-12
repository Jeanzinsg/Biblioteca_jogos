import type { Atributos, NomeAtributo } from "../contratos.ts";
import { ROTULOS_DOS_ATRIBUTOS } from "./atributos.ts";
import { Efeito } from "./Efeito.ts";

export class Reliquia extends Efeito {
  static readonly BONUS_PADRAO = 5;

  constructor(
    private readonly _jogo: string,
    private readonly _atributo: NomeAtributo,
    private readonly _bonus: number = Reliquia.BONUS_PADRAO,
  ) {
    super(`Relíquia de ${_jogo}`);
    if (_bonus <= 0) {
      throw new Error("O bônus de uma relíquia precisa ser positivo.");
    }
  }

  get jogo(): string {
    return this._jogo;
  }

  get atributo(): NomeAtributo {
    return this._atributo;
  }

  get bonus(): number {
    return this._bonus;
  }

  descricao(): string {
    return `+${this._bonus} de ${ROTULOS_DOS_ATRIBUTOS[this._atributo]}`;
  }

  aplicar(atributos: Atributos): Atributos {
    return { ...atributos, [this._atributo]: atributos[this._atributo] + this._bonus };
  }
}
