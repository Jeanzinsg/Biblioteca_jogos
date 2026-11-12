import type { NomeClasse, ResultadoAtaque, Sorteio } from "../contratos.ts";
import { Personagem } from "./Personagem.ts";

export class Guerreiro extends Personagem {
  classe(): NomeClasse {
    return "Guerreiro";
  }

  habilidade(): string {
    return "Golpe de Espada";
  }

  atacar(alvo: Personagem, sorteio: Sorteio): ResultadoAtaque {
    const danoBase = 10 + this.atributos.forca * 0.5;
    return this.resultado(alvo, [this.golpear(alvo, danoBase, sorteio, true)]);
  }
}
