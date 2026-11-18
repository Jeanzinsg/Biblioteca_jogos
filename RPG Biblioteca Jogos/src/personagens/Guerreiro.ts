import type { Combatente } from "../contratos.ts";
import { Personagem } from "./Personagem.ts";

export class Guerreiro extends Personagem {
  classe(): string {
    return "Guerreiro";
  }

  habilidade(): string {
    return "Golpe de Espada (aguenta mais pancada)";
  }

  override vidaMaxima(): number {
    return super.vidaMaxima() + this.atributos.forca;
  }

  atacar(alvo: Combatente): string {
    const dano = 10 + Math.round(this.atributos.forca / 2);
    alvo.receberDano(dano);
    return `${this.nome} desceu ${this.arma} na cabeça do ${alvo.nome}: ${dano} de dano`;
  }
}
