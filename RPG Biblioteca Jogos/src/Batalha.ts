import type { ChefeDoBacklog } from "./personagens/ChefeDoBacklog.ts";
import type { Personagem } from "./personagens/Personagem.ts";

export class Batalha {
  static readonly TAMANHO_MAXIMO_DO_GRUPO = 4;

  private _rodada = 0;

  constructor(
    private readonly herois: Personagem[],
    private readonly chefe: ChefeDoBacklog,
  ) {
    if (herois.length === 0) {
      throw new Error("Chame pelo menos um herói para a batalha.");
    }
    if (herois.length > Batalha.TAMANHO_MAXIMO_DO_GRUPO) {
      throw new Error(`O grupo pode ter no máximo ${Batalha.TAMANHO_MAXIMO_DO_GRUPO} heróis.`);
    }
  }

  get rodada(): number {
    return this._rodada;
  }

  acabou(): boolean {
    return !this.chefe.estaVivo() || this.heroisVivos().length === 0;
  }

  heroisVenceram(): boolean {
    return !this.chefe.estaVivo();
  }

  jogarRodada(): string[] {
    if (this.acabou()) {
      throw new Error("A batalha já acabou.");
    }
    this._rodada++;
    const relato: string[] = [];

    for (const heroi of this.herois) {
      if (heroi.estaVivo() && this.chefe.estaVivo()) {
        relato.push(heroi.atacar(this.chefe));
      }
    }

    const vivos = this.heroisVivos();
    const alvo = vivos[this._rodada % vivos.length];
    if (this.chefe.estaVivo() && alvo !== undefined) {
      relato.push(this.chefe.atacar(alvo));
      if (!alvo.estaVivo()) {
        relato.push(`${alvo.nome} largou o controle e foi dormir.`);
      }
    }
    return relato;
  }

  placar(): string {
    const herois = this.herois.map((heroi) => `${heroi.nome} ${heroi.vida}`);
    return `[Chefe ${this.chefe.vida}] x [${herois.join(" | ")}]`;
  }

  private heroisVivos(): Personagem[] {
    return this.herois.filter((heroi) => heroi.estaVivo());
  }
}
