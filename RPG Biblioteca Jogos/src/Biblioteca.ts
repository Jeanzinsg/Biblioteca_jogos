import type { JogoSteam } from "./contratos.ts";

export class Biblioteca {
  constructor(private readonly jogos: JogoSteam[]) {}

  horasTotais(): number {
    let total = 0;
    for (const jogo of this.jogos) {
      total += jogo.horas;
    }
    return total;
  }

  horasNosGeneros(generos: string[]): number {
    let total = 0;
    for (const jogo of this.jogos) {
      const ehDoGenero = jogo.generos.some((genero) => generos.includes(genero));
      if (ehDoGenero) {
        total += jogo.horas;
      }
    }
    return total;
  }

  jogoMaisJogado(): string {
    let nome = "as próprias mãos";
    let maisHoras = 0;
    for (const jogo of this.jogos) {
      if (jogo.horas > maisHoras) {
        maisHoras = jogo.horas;
        nome = jogo.nome;
      }
    }
    return nome;
  }

  jogosNuncaJogados(): string[] {
    const parados: string[] = [];
    for (const jogo of this.jogos) {
      if (jogo.horas === 0) {
        parados.push(jogo.nome);
      }
    }
    return parados;
  }
}
