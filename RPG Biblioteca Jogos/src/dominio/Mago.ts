import type { NomeClasse, ResultadoAtaque, Sorteio } from "../contratos.ts";
import { Personagem } from "./Personagem.ts";

export class Mago extends Personagem {
  classe(): NomeClasse {
    return "Mago";
  }

  habilidade(): string {
    return "Bola de Fogo";
  }

  atacar(alvo: Personagem, sorteio: Sorteio): ResultadoAtaque {
    const danoBase = 8 + this.atributos.inteligencia * 0.5;
    return this.resultado(alvo, [this.golpear(alvo, danoBase, sorteio, false)]);
  }
}
