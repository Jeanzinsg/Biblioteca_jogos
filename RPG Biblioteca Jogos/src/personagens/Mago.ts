import type { Combatente } from "../contratos.ts";
import { Personagem } from "./Personagem.ts";

export class Mago extends Personagem {
  classe(): string {
    return "Mago";
  }

  habilidade(): string {
    return "Bola de Fogo (bate forte, mas é frágil)";
  }

  override vidaMaxima(): number {
    return super.vidaMaxima() - 20;
  }

  atacar(alvo: Combatente): string {
    const dano = 15 + Math.round(this.atributos.inteligencia * 0.6);
    alvo.receberDano(dano);
    return `${this.nome} conjurou uma Bola de Fogo de ${this.arma}: ${dano} de dano`;
  }
}
