import { StatusJogo } from "../enums/enums.ts";
import { Jogo } from "../modelos/Jogo.ts";

export class Filtros {
  constructor(private readonly jogos: Jogo[]) {}

  porConsole(plataforma: string): Jogo[] {
    const p = plataforma.toLowerCase();
    return this.jogos.filter((j) => j.plataforma.toLowerCase() === p);
  }

  porNotaMinima(notaMinima: number): Jogo[] {
    return this.jogos.filter((j) => {
      const nota = j.obterNotaGeral();
      return nota !== null && nota >= notaMinima;
    });
  }

  porGenero(genero: string): Jogo[] {
    const g = genero.toLowerCase();
    return this.jogos.filter((j) => j.genero.toLowerCase() === g);
  }

  porStatus(status: StatusJogo): Jogo[] {
    return this.jogos.filter((j) => j.status === status);
  }

  porAno(ano: number): Jogo[] {
    return this.jogos.filter((j) => j.anoLancamento === ano);
  }

  porTermo(termo: string): Jogo[] {
    return this.jogos.filter((j) => j.corresponde(termo)); // usa Pesquisavel
  }
}

export class Ordenacao {
  /** Maior nota primeiro; jogos sem review vão para o fim. */
  static porNota(jogos: Jogo[]): Jogo[] {
    return [...jogos].sort((a, b) => (b.obterNotaGeral() ?? -1) - (a.obterNotaGeral() ?? -1));
  }

  static porAno(jogos: Jogo[], decrescente = false): Jogo[] {
    return [...jogos].sort((a, b) =>
      decrescente ? b.anoLancamento - a.anoLancamento : a.anoLancamento - b.anoLancamento
    );
  }

  static porHorasJogadas(jogos: Jogo[]): Jogo[] {
    return [...jogos].sort((a, b) => b.progresso.horasJogadas - a.progresso.horasJogadas);
  }
}
