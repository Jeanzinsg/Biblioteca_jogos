import { DadosInvalidosError } from "../erros/Erros.ts";

export interface PesosNotas {
  jogabilidade: number;
  historia: number;
  trilhaSonora: number;
  graficos: number;
}

export class Notas {
  static readonly PESOS_PADRAO: PesosNotas = {
    jogabilidade: 0.4,
    historia: 0.2,
    trilhaSonora: 0.15,
    graficos: 0.25,
  };

  constructor(
    public readonly jogabilidade: number,
    public readonly historia: number,
    public readonly trilhaSonora: number,
    public readonly graficos: number
  ) {
    for (const [nome, valor] of Object.entries({ jogabilidade, historia, trilhaSonora, graficos })) {
      if (isNaN(valor) || valor < 0 || valor > 10) {
        throw new DadosInvalidosError(`Nota de ${nome} deve estar entre 0 e 10 (recebido: ${valor}).`);
      }
    }
  }

  mediaSimples(): number {
    return (this.jogabilidade + this.historia + this.trilhaSonora + this.graficos) / 4;
  }

  mediaPonderada(pesos: PesosNotas = Notas.PESOS_PADRAO): number {
    return (
      this.jogabilidade * pesos.jogabilidade +
      this.historia * pesos.historia +
      this.trilhaSonora * pesos.trilhaSonora +
      this.graficos * pesos.graficos
    );
  }

  toString(): string {
    return `Jogabilidade ${this.jogabilidade} | Historia ${this.historia} | Trilha ${this.trilhaSonora} | Graficos ${this.graficos}`;
  }
}
