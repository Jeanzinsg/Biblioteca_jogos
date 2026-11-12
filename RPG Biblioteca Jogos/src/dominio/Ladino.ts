import type { Golpe, NomeClasse, ResultadoAtaque, Sorteio } from "../contratos.ts";
import { Personagem } from "./Personagem.ts";

export class Ladino extends Personagem {
  static readonly GOLPES_POR_ATAQUE = 2;

  classe(): NomeClasse {
    return "Ladino";
  }

  habilidade(): string {
    return "Ataque Duplo";
  }

  atacar(alvo: Personagem, sorteio: Sorteio): ResultadoAtaque {
    const danoBase = 5 + this.atributos.agilidade * 0.35;
    const golpes: Golpe[] = [];
    for (let i = 0; i < Ladino.GOLPES_POR_ATAQUE && alvo.estaVivo(); i++) {
      golpes.push(this.golpear(alvo, danoBase, sorteio, true));
    }
    return this.resultado(alvo, golpes);
  }
}
