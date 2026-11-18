import type { Combatente } from "../contratos.ts";
import { Personagem } from "./Personagem.ts";

export class Ladino extends Personagem {
  classe(): string {
    return "Ladino";
  }

  habilidade(): string {
    return "Ataque Duplo (golpeia duas vezes)";
  }

  atacar(alvo: Combatente): string {
    const dano = 6 + Math.round(this.atributos.agilidade / 3);
    alvo.receberDano(dano);
    let golpes = 1;
    if (alvo.estaVivo()) {
      alvo.receberDano(dano);
      golpes = 2;
    }
    return `${this.nome} atacou rapidinho com ${this.arma}: ${golpes}x ${dano} de dano`;
  }
}
