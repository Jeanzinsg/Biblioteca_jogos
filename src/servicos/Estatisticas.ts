import { StatusJogo } from "../enums/enums.ts";
import { DadosInvalidosError } from "../erros/Erros.ts";
import { Jogo } from "../modelos/Jogo.ts";

export class Estatisticas {
  constructor(private readonly jogos: Jogo[]) {}

  /** % de jogos zerados sobre o total (ignora wishlist, pois não são possuídos). */
  taxaConclusao(): number {
    const possuidos = this.jogos.filter((j) => j.status !== StatusJogo.WISHLIST);
    if (possuidos.length === 0) return 0;
    const zerados = possuidos.filter((j) => j.status === StatusJogo.ZERADO).length;
    return (zerados / possuidos.length) * 100;
  }

  /** Valor pago ÷ horas jogadas de um jogo específico. */
  custoPorHora(jogo: Jogo): number {
    if (jogo.progresso.horasJogadas <= 0) {
      throw new DadosInvalidosError(`"${jogo.nome}" ainda nao tem horas jogadas registradas.`);
    }
    return jogo.valorPago / jogo.progresso.horasJogadas;
  }

  /** Gênero que mais aparece na coleção (null se vazia). */
  generoMaisFrequente(): string | null {
    if (this.jogos.length === 0) return null;
    const contagem = new Map<string, number>();
    for (const j of this.jogos) {
      contagem.set(j.genero, (contagem.get(j.genero) ?? 0) + 1);
    }
    let melhor: string | null = null;
    let max = 0;
    for (const [genero, qtd] of contagem) {
      if (qtd > max) {
        max = qtd;
        melhor = genero;
      }
    }
    return melhor;
  }

  /** Retorna Map<plataforma, quantidade>. */
  distribuicaoPorPlataforma(): Map<string, number> {
    const dist = new Map<string, number>();
    for (const j of this.jogos) {
      dist.set(j.plataforma, (dist.get(j.plataforma) ?? 0) + 1);
    }
    return dist;
  }

  /** Versão em tabela de texto da distribuição. */
  tabelaDistribuicaoPorPlataforma(): string {
    const dist = this.distribuicaoPorPlataforma();
    if (dist.size === 0) return "Coleção vazia.";
    const total = this.jogos.length;
    const linhas = [
      "Plataforma          | Qtd | %      | Barra",
      "--------------------+-----+--------+--------------------",
    ];
    for (const [plataforma, qtd] of [...dist].sort((a, b) => b[1] - a[1])) {
      const pct = (qtd / total) * 100;
      const barra = "█".repeat(Math.round(pct / 5));
      linhas.push(`${plataforma.padEnd(20)}| ${String(qtd).padStart(3)} | ${pct.toFixed(1).padStart(5)}% | ${barra}`);
    }
    return linhas.join("\n");
  }

  totalHorasJogadas(): number {
    return this.jogos.reduce((acc, j) => acc + j.progresso.horasJogadas, 0);
  }

  totalInvestido(): number {
    return this.jogos.reduce((acc, j) => acc + j.valorPago, 0);
  }
}
