import type { ConquistaRara, JogoSteam } from "../contratos.ts";

export class Biblioteca {
  constructor(private readonly jogos: JogoSteam[]) {}

  quantidadeDeJogos(): number {
    return this.jogos.length;
  }

  horasTotais(): number {
    let total = 0;
    for (const jogo of this.jogos) {
      total += jogo.horas;
    }
    return total;
  }

  horasPorGenero(genero: string): number {
    let total = 0;
    for (const jogo of this.jogos) {
      if (jogo.generos.includes(genero)) {
        total += jogo.horas / jogo.generos.length;
      }
    }
    return total;
  }

  generoMaisJogado(): string | undefined {
    let melhorGenero: string | undefined = undefined;
    let melhorHoras = 0;

    for (const genero of this.todosOsGeneros()) {
      const horas = this.horasPorGenero(genero);
      if (horas > melhorHoras) {
        melhorHoras = horas;
        melhorGenero = genero;
      }
    }
    return melhorGenero;
  }

  percentualDeConquistas(): number {
    let feitas = 0;
    let total = 0;
    for (const jogo of this.jogos) {
      feitas += jogo.conquistasFeitas;
      total += jogo.conquistasTotal;
    }
    if (total === 0) {
      return 0;
    }
    return (feitas / total) * 100;
  }

  jogosCompletos(): JogoSteam[] {
    const completos: JogoSteam[] = [];
    for (const jogo of this.jogos) {
      if (jogo.conquistasTotal > 0 && jogo.conquistasFeitas === jogo.conquistasTotal) {
        completos.push(jogo);
      }
    }
    return completos;
  }

  conquistasRaras(): ConquistaRara[] {
    const raras: ConquistaRara[] = [];
    for (const jogo of this.jogos) {
      for (const conquista of jogo.conquistasRaras) {
        raras.push({ nome: conquista, jogo: jogo.nome });
      }
    }
    return raras;
  }

  jogosNuncaJogados(): number {
    let quantidade = 0;
    for (const jogo of this.jogos) {
      if (jogo.horas === 0) {
        quantidade++;
      }
    }
    return quantidade;
  }

  private todosOsGeneros(): string[] {
    const generos: string[] = [];
    for (const jogo of this.jogos) {
      for (const genero of jogo.generos) {
        if (!generos.includes(genero)) {
          generos.push(genero);
        }
      }
    }
    return generos;
  }
}
